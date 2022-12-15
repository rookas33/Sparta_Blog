const express = require("express");
const router = express.Router();
const Comments = require("../schemas/commentsSchema");


// 댓글 작성 API
router.post('/', async (req, res) => {
    const { user, password, content } = req.body;
    if (!content) {
        return res.status(400).json({
            message: "댓글 내용을 입력해 주세요."
        });
    }
    if (!user || !password || !content) {
        return res.status(400).json({
            message: "데이터 형식이 올바르지 않습니다."
        });
    };
    await Comments.create({ user, password, content });
    res.status(200).json({ message: "댓글을 생성했습니다." })
});

// 댓글 조회 API
router.get('/', async (req, res) => {
    const comments = await Comments.find({}, { password: false, __v: false })
    res.status(200).json({ comments })
});


// 댓글 수정 API
router.put('/:_commentId', async (req, res) => {
    try {
        const { password, content } = req.body;
        const { _commentId } = req.params;
        const comments = await Comments.findOne({ _id: _commentId }, { __v: false })
        if (password != comments.password) {
            return res.status(400).json({ message: "올바른 비밀번호를 입력해 주세요." })
        }
        if (!content) {
            return res.status(400).json({ message: "댓글 내용을 입력해 주세요." })
        }
        if (!password || !content) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        await Comments.updateOne(
            { _id: _commentId },
            { $set: { content: content } }
        )
    } catch (err) {
        const { _commentId } = req.params;
        if (_commentId.length != 24) {
            return res.status(500).json({ message: "댓글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "게시글을 수정했습니다" })
});



// 댓글 삭제 API
router.delete('/:_commentId', async (req, res) => {
    try {
        const { password } = req.body;
        const { _commentId } = req.params;
        const comments = await Comments.findOne({ _id: _commentId })
        console.log(password, comments.password)
        if (!password) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        if (password != comments.password) {
            return res.status(400).json({ message: "올바른 비밀번호를 입력해 주세요" })
        }
        await Comments.deleteOne({ _id: _commentId }
        )
    } catch (err) {
        const { _commentId } = req.params;
        if (_commentId.length != 24) {
            return res.status(500).json({ message: "댓글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "댓글을 삭제했습니다" })

});


module.exports = router;