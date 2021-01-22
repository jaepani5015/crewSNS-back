const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', (req, res) => {

});

router.post('/', async (req, res, next) => {
    const { id, pw } = req.body;
    try {
        const exUser = await prisma.user.findFirst({
            where: {
                user_id: id,
            }
        });
        if (exUser) return res.status(403).send('이미 사용중인 계정입니다.');
        const hashedPassword = await bcrypt.hash(pw, 13);
        const newUser = await prisma.user.create({
            data: {
                user_id: id,
                user_pw: hashedPassword,
            }
        });
        return res.status(200).json(newUser);
    } catch (e) {
        console.error(e);
        // res.status(400).send('')
        return next(e);
    }
});

router.post('/login', (req, res, next) => {
    // 로그인 처리 시 cookie와 session을 동시에 작업해줄 passport기능 사용
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }

        if (info) return res.status(401).json(info.reason);

        return req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            const filterdUser = Object.assign({}, user);
            delete filterdUser.user_pw;
            return res.json(filterdUser);
        });
    })(req, res, next)
});

router.post('/logout', (req, res) => {

});

router.patch('/:id/userModify', (req, res) => {

});

router.delete('/:id/userDelete', (req, res) => {

});

module.exports = router;