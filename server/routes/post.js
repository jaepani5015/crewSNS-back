const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const multer = require('multer');
const path = require('path');
const moment = require('moment');

// 포스트 부분
router.get('/postCall', async (req, res) => {
    try {
        const callPost = await prisma.post.findMany({
            orderBy: {
                // post_id: 'desc'
                post_createdate: 'desc',
            },
        });
        const callImage = await prisma.image.findMany({

        });
        const callReply = await prisma.reply.findMany({

        });
        return res.json({
            content: callPost,
            image: callImage,
            reply: callReply,
        });
    } catch (e) {
        console.error(e);
        res.status(401).send('포스트 조회 실패');
    }
});

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
})

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
            console.log('createPostTitleContent ::: ', createPostTitleContent);
        } else console.log('createPostTitleContent ::: ', createPostTitleContent);
        // 포스트 업로드 성공 시 이미지 업로드
        if (Array.isArray(req.body.images)) {
            await req.body.images.map(async (data) => {
                await prisma.image.create({
                    data: {
                        image_link: process.env.IMAGE_BASEURL + data,
                        post: {
                            connect: { post_id: createPostTitleContent.post_id }
                        }
                    }
                });
            });
        } else {
            await prisma.image.create({
                data: {
                    image_link: process.env.IMAGE_BASEURL + req.body.images,
                    post: {
                        connect: { post_id: createPostTitleContent.post_id }
                    }
                }
            });
        }
        res.status(200).send('post create success');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/postImages', upload.array('image'), (req, res) => {
    console.log(req.files);
    res.json(req.files.map(v => v.filename));
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