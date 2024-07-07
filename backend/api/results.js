const express = require('express');
const router = express.Router();
const Result = require('../models/Result'); // Ensure you have a models directory with Result.js
const Assessment = require('../models/Assessment'); // Ensure you have a models directory with Assessment.js

// POST route to save assessment results
router.post('/', async (req, res) => {
    const { examName, userId, answers } = req.body;
    if (!examName || !userId || !answers) {
        return res.status(400).send('Exam Name, User ID, and Answers are required');
    }

    try {
        const result = new Result({ examName, userId, answers });

        // Calculate the score
        const assessment = await Assessment.findOne({ examName });
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }

        let score = 0;
        for (const answer of answers) {
            const question = assessment.questions.find(q => q.questionID === answer.questionID);
            if (question && question.correctAnswer === answer.answer) {
                score++;
                answer.isCorrect = true;
            } else {
                answer.isCorrect = false;
            }
        }

        result.score = score;
        await result.save();

        res.status(201).json({
            message: 'Result saved successfully',
            examName: result.examName,
            userId: result.userId,
            score: result.score,
            answers: result.answers
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
