const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [{
        questionID: String,
        answer: String,
        isCorrect: Boolean
    }],
    score: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', resultSchema);
