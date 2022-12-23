const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const { Comment } = require("../models")
const { User } = require("../models");

const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 작성 API
router.post('/:_postId/comments', authMiddleware, async (req, res) => {
    const { _postId } = req.params;
    const { comment } = req.body;
    const { nickname } = res.locals.user;

    if (!comment) {
        return res.status(400).json({
            message: "댓글 내용을 입력해 주세요."
        });
    }

    await Comment.create({ postId: _postId, nickname: nickname, comment: comment });
    res.status(200).json({ message: "댓글을 생성했습니다." })
});

// 댓글 조회 API
router.get('/:_postId/comments', async (req, res) => {
    const { _postId } = req.params;
    const comments = await Comment.findAll({ where: { postId: _postId } })
    res.status(200).json({ comments })
});


// 댓글 수정 API
router.put('/:_postId/comments/:_commentId', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;
        const { _commentId } = req.params;
        if (!comment) {
            return res.status(400).json({ message: "댓글 내용을 입력해 주세요." })
        }

        await Comment.update(
            { comment: comment },
            { where: { commentId: _commentId } },
        )
    } catch (err) {
        const { _commentId } = req.params;
        if (_commentId.length) {
            return res.status(500).json({ message: "댓글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "게시글을 수정했습니다" })
});


// 댓글 삭제 API
router.delete('/:_postId/comments/:_commentId', authMiddleware, async (req, res) => {
    try {
        const { nickname } = res.locals.user;
        const { password } = req.body;
        const { _commentId } = req.params;
        const user = await User.findOne({ where: { nickname: nickname, password: password } });
        if (!password || !nickname) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        if (password !== user.password || nickname !== user.nickname) {
            return res.status(400).json({ message: "올바른 비밀번호와 닉네임을 입력해 주세요" });
        }

        await Comment.destroy({ where: { commentId: _commentId } });

    } catch (err) {
        const { _commentId } = req.params;
        if (_commentId.length) {
            return res.status(500).json({ message: "댓글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "댓글을 삭제했습니다" })

});


module.exports = router;