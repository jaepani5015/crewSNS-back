const express = require('express');
const router = express.Router();

// 포스트 부분
router.get('/postCall', (req, res) => {

});

router.post('/postCreate', (req, res) => {

});

// id는 req.params.id로 가져올 수 있다.
router.patch('/:id/postModify', (req, res) => {

});

router.delete('/:id/postDelete', (req, res) => {

});

router.post('/:id/postReply', (req, res) => {

});

router.delete('/:id/postDeleteReply', (req, res) => {

});

module.exports = router;