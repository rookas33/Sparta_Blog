const express = require('express');
const app = express();
const port = 3000;
const postsRouter = require('./routes/posts.js');
const commentsRouter = require('./routes/comments.js');

const connect = require("./schemas");
connect();

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/mainpage.html");
});

app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);


app.get("/:id", (req, res) => {
    console.log(req.params);
    res.send(req.params);
});



app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});