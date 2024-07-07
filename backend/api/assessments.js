const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment'); // Ensure you have a models directory with Assessment.js

// POST route to create an assessment
router.post('/', async (req, res) => {
    const { examName, examCategory } = req.body;
    if (!examName || !examCategory) {
        return res.status(400).send('Exam Name and Exam Category are required');
    }
    try {
        const newAssessment = new Assessment({ examName, examCategory });
        await newAssessment.save();
        res.status(201).send('Assessment created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET route to fetch all assessments
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment.find();
        res.status(200).json(assessments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// DELETE route to delete an assessment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Assessment.findByIdAndDelete(id);
        res.status(200).send('Assessment deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET route to fetch an assessment by ID
router.get('/:id', async (req, res) => {
    console.log(`Fetching assessment with ID: ${req.params.id}`);
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.json(assessment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT route to update an assessment
router.put('/:id', async (req, res) => {
    const { examName, examCategory } = req.body;
    try {
        const assessment = await Assessment.findByIdAndUpdate(
            req.params.id,
            { examName, examCategory },
            { new: true }
        );
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.json(assessment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST route to add a question to an assessment
router.post('/:id/questions', async (req, res) => {
    const { id } = req.params;
    const { questionID, question, questionType, questionCategory, nextQuestions, options } = req.body;

    if (!questionID || !question || !questionType || !questionCategory) {
        return res.status(400).send('Question ID, Question, Question Type, and Question Category are required');
    }

    try {
        const assessment = await Assessment.findById(id);
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }

        const newQuestion = { questionID, question, questionType, questionCategory, nextQuestions, options };
        assessment.questions.push(newQuestion);
        await assessment.save();

        res.status(201).json({
            message: 'Question added successfully',
            examName: assessment.examName,
            examCategory: assessment.examCategory,
            question: newQuestion
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// PUT route to update a question in an assessment
router.put('/:assessmentId/questions/:questionId', async (req, res) => {
    const { assessmentId, questionId } = req.params;
    const { questionID, question, questionType, questionCategory, nextQuestions, options } = req.body;

    if (!questionID || !question || !questionType || !questionCategory) {
        return res.status(400).send('Question ID, Question, Question Type, and Question Category are required');
    }

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }

        const questionIndex = assessment.questions.findIndex(q => q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).send('Question not found');
        }

        assessment.questions[questionIndex] = { _id: questionId, questionID, question, questionType, questionCategory, nextQuestions, options };
        await assessment.save();

        res.status(200).json({
            message: 'Question updated successfully',
            examName: assessment.examName,
            examCategory: assessment.examCategory,
            question: assessment.questions[questionIndex]
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// DELETE route to delete a question from an assessment
router.delete('/:assessmentId/questions/:questionId', async (req, res) => {
    const { assessmentId, questionId } = req.params;

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }

        assessment.questions = assessment.questions.filter(q => q._id.toString() !== questionId);
        await assessment.save();

        res.status(200).send('Question deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET route to fetch questions for a specific assessment by exam name
router.get('/:examName/questions', async (req, res) => {
    const { examName } = req.params;
    try {
        const assessment = await Assessment.findOne({ examName });
        if (!assessment) {
            return res.status(404).send('Assessment not found');
        }
        res.json(assessment.questions.sort((a, b) => a.questionID - b.questionID)); // Ensure questions are sorted by QuestionID
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
