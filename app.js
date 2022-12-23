
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const app = express();
const port = 3000;

app.use(express.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get("/", (req, res) => {
    res.render('index');
});
const { User } = require("./models");
const { Op } = require("sequelize");
const authMiddleware = require("./middlewares/auth-middleware");

const postsRouter = require('./routes/posts.js');
const commentsRouter = require('./routes/comments.js');
app.use("/posts", [postsRouter, commentsRouter]);

// 회원가입
router.post("/users", async (req, res) => {
    const { nickname, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
        });
        return;
    }

    // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findAll({
        where: {
            [Op.or]: [{ nickname }],
        },
    });
    if (existsUsers.length) {
        res.status(400).send({
            errorMessage: "이미 사용중인 닉네임입니다.",
        });
        return;
    }

    await User.create({ nickname, password });
    res.status(201).send({});
});

// 로그인
router.post("/auth", async (req, res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({
        where: {
            nickname,
        },
    });

    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
        });
        return;
    }

    res.send({
        token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
    });
});

app.use("/api", express.urlencoded({ extended: false }), router);

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});