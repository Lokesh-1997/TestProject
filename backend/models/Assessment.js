const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },
    examCategory: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const Assessment = mongoose.model('Assessment', AssessmentSchema);

module.exports = Assessment;
