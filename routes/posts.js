const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const { User } = require("../models");

const authMiddleware = require("../middlewares/auth-middleware");
const { where } = require("sequelize");


// 게시글 작성 API
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const { nickname } = res.locals.user;
    if (!title || !content) {
        return res.json({
            message: "데이터 형식이 올바르지 않습니다"
        });
    };
    await Post.create({ nickname, title, content });
    res.json({ message: "게시글을 생성했습니다" })
});

// 게시글 목록 조회 API // attributes
router.get('/', async (req, res) => {
    const posts = await Post.findAll({ attributes: ['postId', 'nickname', 'title', 'like'], });
    res.status(200).json({ posts })
});

// 게시글 조회 API
router.get('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const post = await Post.findOne({ where: { postId: _postId } });

        if (!post) {
            return res.json({ message: "없는 게시물 입니다." })
        }
        res.status(200).json({ post })
    } catch (err) {
        const { _postId } = req.params;
        if (_postId.length) {
            return res.status(500).json({ message: "게시글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }

});

// 게시글 수정 API
router.put('/:_postId', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { _postId } = req.params;
        const post = await Post.findOne({ where: { postId: _postId } });
        if (!title || !content) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }

        await Post.update(
            { title: title, content: content },
            { where: { postId: _postId } }
        )


    } catch (err) {
        console.log(err.message)
        const { _postId } = req.params;
        if (_postId.length) {
            return res.status(500).json({ message: "게시글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "게시글을 수정했습니다" })

});



// 게시글 삭제 API
router.delete('/:_postId', authMiddleware, async (req, res) => {
    try {
        const { nickname, password } = req.body;
        const { _postId } = req.params;

        const user = await User.findOne({ where: { nickname: nickname, password: password } })

        if (!nickname || !password) {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        if (password !== user.password || nickname !== user.nickname) {
            return res.status(400).json({ message: "올바른 비밀번호와 닉네임을 입력해 주세요" })
        }
        await Post.destroy({ where: { postId: _postId } })
    } catch (err) {
        const { _postId } = req.params;
        if (_postId.length) {
            return res.status(500).json({ message: "게시글 조회에 실패하였습니다." })
        }
        res.status(500).json({ error: err.message })
    }
    res.status(200).json({ message: "게시글을 삭제했습니다" })

});

// 게시글 좋아요
router.put("/:_postId/like", authMiddleware, async (req, res) => {
    const { _postId } = req.params;
    console.log(_postId)
    await Post.increment({ like: 1 }, { where: { postId: _postId } });


    res.status(200).json({ message: "좋아요를 눌렀습니다!" })
});




module.exports = router;