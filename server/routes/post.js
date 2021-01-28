const express = require('express');
const router = express.Router();
const path = require('path');
const moment = require('moment');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const s3 = new AWS.S3({
    "accessKeyId": process.env.ACCESS_KEY_ID,
    "secretAccessKey": process.env.SECREAT_ACCESS_KEY,
    "region": "ap-northeast-2"
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "crewsns",
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            cb(null, basename + new Date().valueOf() + ext);
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});

/* 로컬 스토리지에 업로드 할 때 multer */
/*
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'upload')
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            console.log(`ext :: ${ext} /// basename :: ${basename} /// fullname :: ${basename + new Date().valueOf() + ext}`);
            cb(null, basename + new Date().valueOf() + ext);
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
});
*/

// 포스트 부분
router.get('/postCall', async (req, res) => {
    const { skip, take } = req.query;
    try {
        const callPost = await prisma.post.findMany({
            skip: parseInt(skip),
            take: parseInt(take),
            orderBy: {
                post_id: 'desc'
            }
        });

        const callPostResult = callPost.map(e => e.post_id);
        if (callPostResult.length !== 0) {
            const callImage = await prisma.image.findMany({
                where: {
                    image_author: {
                        in: callPostResult
                    }
                }
            });

            const callReply = await prisma.reply.findMany({
                where: {
                    reply_post_author: {
                        in: callPostResult
                    }
                }
            });

            if (callImage.length !== 0) {
                return res.json({
                    content: callPost,
                    image: callImage,
                    reply: callReply,
                });
            }
            return res.json({
                content: callPost,
                image: callImage,
                reply: callReply,
            });
        } else console.log('포스트 조회 실패');
    } catch (e) {
        console.error(e);
        res.status(401).send('포스트 리스트 조회 실패');
    }
});

router.post('/postCreate', upload.none(), async (req, res, next) => {
    const time = moment().format('llll');
    try {
        const createPostTitleContent = await prisma.post.create({
            data: {
                post_title: req.body.title,
                post_content: req.body.content,
                post_createdate: time,
                user: {
                    connect: { user_id: req.body.user },
                },
            },
        });
        if (!createPostTitleContent) {
            // 포스트 업로드 실패시
            res.status(400).send('포스트 업로드 실패!!!');
        }
        // 포스트 업로드 성공 시 이미지 업로드
        if (Array.isArray(req.body.images)) {
            await req.body.images.map(async (data) => {
                await prisma.image.create({
                    data: {
                        image_link: data,
                        post: {
                            connect: { post_id: createPostTitleContent.post_id }
                        }
                    }
                });
            });
        } else {
            if (req.body.images !== undefined) {
                await prisma.image.create({
                    data: {
                        image_link: req.body.images,
                        post: {
                            connect: { post_id: createPostTitleContent.post_id }
                        }
                    }
                });
            }
        }
        res.status(200).send('post create success');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/postImages', upload.array('image'), (req, res) => {
    // console.log('req.files :::', req.files);
    res.json(req.files.map(v => v.location));
});

// id는 req.params.id로 가져올 수 있다.
router.patch('/:id/postModify', (req, res) => {

});

router.delete('/:id/postDelete', (req, res) => {

});

router.post('/:id/postReply', async (req, res, next) => {
    const { replyContent, userId } = req.body;
    const time = moment().format('llll');
    console.log(req.params.id);
    try {
        const createReply = await prisma.reply.create({
            data: {
                reply_content: replyContent,
                reply_createdate: time,
                user: {
                    connect: { user_id: userId }
                },
                post: {
                    connect: { post_id: parseInt(req.params.id) }
                }
            }
        });
        console.log(createReply);
        res.json(createReply);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id/postDeleteReply', (req, res) => {

});

module.exports = router;
