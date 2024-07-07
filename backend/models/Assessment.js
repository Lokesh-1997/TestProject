const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true
    },
    examCategory: {
        type: String,
        required: true
    },
    questions: {
        type: [{
            questionID: String,
            question: String,
            questionType: String,
            questionCategory: String,
            nextQuestions: String,
            options: [String]
        }],
        default: []
    }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
