const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// 사용자 부분
router.get('/', (req, res) => {

});

router.post('/', async (req, res) => {
    const { id, pw } = req.body;
    try {
        const inqCheck = await prisma.user.findFirst({
            where: {
                user_id: id,
            }
        });
        if (inqCheck) {
            return res.status(403).send('이미 사용중인 계정입니다.');
        } else {
            const inqRegist = await prisma.user.create({
                data: {
                    user_id: id,
                    user_pw: pw,
                }
            });
            return res.json(inqRegist);
        }
    } catch (e) {
        console.error(e);
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