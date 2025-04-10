const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    hook: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    outro: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Article', articleSchema);
