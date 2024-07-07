// models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true
    },
    examCategory: {
        type: String,
        required: true
    }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
