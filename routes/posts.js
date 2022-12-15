const express = require("express");
const router = express.Router();
const Posts = require("../schemas/postsSchema");


// 게시글 작성 API
router.post('/', async (req, res) => {
    const { user, password, title, content } = req.body;
    if (!user || !password || !title || !content) {
        return res.json({
            message: "데이터 형식이 올바르지 않습니다"
        });
    };
    await Posts.create({ user, password, title, content });
    res.json({ message: "게시글을 생성했습니다" })
});

// 게시글 조회 API
router.get('/', async (req, res) => {
    const posts = await Posts.find({}, { password: false, content: false, __v: false })
    res.status(200).json({ posts })
    console.log(posts)
});

// 게시글 상세 조회 API
router.get('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const posts = await Posts.findOne({ _id: _postId }, { password: false, __v: false })
        if (!posts) {
            return res.json({ message: "없는 게시물 입니다." })
        }
        res.status(200).json({ posts })
    } catch (err) {
        const { _postId } = req.params;
        if (_postId.length != 24) {
            return res.status(500).json({ message: "게시글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }

});

// 게시글 수정 API
router.put('/:_postId', async (req, res) => {

    try {
        const { password, title, content } = req.body;
        const { _postId } = req.params;
        const posts = await Posts.findOne({ _id: _postId }, { __v: false })
        if (!password || !title || !content) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        if (password != posts.password) {
            return res.status(400).json({ message: "올바른 비밀번호를 입력해 주세요" })
        }
        await Posts.updateOne(
            { _id: _postId },
            { $set: { title: title, content: content } }
        )


    } catch (err) {
        const { _postId } = req.params;
        if (_postId.length != 24) {
            return res.status(500).json({ message: "게시글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "게시글을 수정했습니다" })

});



// 게시글 삭제 API
router.delete('/:_postId', async (req, res) => {
    try {
        const { password } = req.body;
        const { _postId } = req.params;
        const posts = await Posts.findOne({ _id: _postId })
        if (!password) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        if (password != posts.password) {
            return res.status(400).json({ message: "올바른 비밀번호를 입력해 주세요" })
        }
        await Posts.deleteOne({ _id: _postId }
        )
    } catch (err) {
        const { _postId } = req.params;
        if (_postId.length != 24) {
            return res.status(500).json({ message: "게시글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "게시글을 삭제했습니다" })

});


module.exports = router;