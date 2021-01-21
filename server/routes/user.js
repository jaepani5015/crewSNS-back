const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


// 사용자 부분
router.get('/', (req, res) => {

});

router.post('/', async (req, res, next) => {
    const {id, pw} = req.body;
    try {
        const exUser = await prisma.user.findFirst({
            where: {
                user_id: id,
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 계정입니다.');
        }
        const hashedPassword = await bcrypt.hash(pw, 13);
        const newUser = await prisma.user.create({
            data: {
                user_id: id,
                user_pw: hashedPassword,
            }
        });
        console.log(newUser);
        return res.status(200).json(newUser);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.post('/login', (req, res) => {

});

router.post('/logout', (req, res) => {

});

router.patch('/:id/userModify', (req, res) => {

});

router.delete('/:id/userDelete', (req, res) => {

});

module.exports = router;