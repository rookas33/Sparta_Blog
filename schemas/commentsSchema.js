const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    password: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comments", commentsSchema);