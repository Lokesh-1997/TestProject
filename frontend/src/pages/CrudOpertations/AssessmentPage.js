import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AssessmentPage.css';

function AssessmentPage() {
    const { state } = useLocation();
    const { examName, examCategory } = state || {};
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const [currentQuestionIDs, setCurrentQuestionIDs] = useState([]);
    const [questionHistory, setQuestionHistory] = useState([]); // Stores arrays of question IDs

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${examName}/questions`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                    if (data.length > 0) {
                        setCurrentQuestionIDs([data[0].questionID]);
                        setQuestionHistory([[data[0].questionID]]); // Initialize history with the first question
                    }
                } else {
                    console.error('Failed to fetch questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [examName]);

    const handleNextQuestion = () => {
        const newQuestionIDs = [];
        currentQuestionIDs.forEach(id => {
            const currentQuestion = questions.find(q => q.questionID === id);
            if (currentQuestion && currentQuestion.nextQuestions) {
                // Handle Yes or No question separately
                if (currentQuestion.questionType === 'MCQ' && currentQuestion.options.includes('Yes') && currentQuestion.options.includes('No')) {
                    let selectedAnswer = answers[currentQuestion.questionID];
                    if (!selectedAnswer) {
                        selectedAnswer = 'Yes'; // Default to Yes if no answer is selected
                    }

                    const nextQuestionsArray = currentQuestion.nextQuestions.split(',').map(q => q.trim());
                    console.log(nextQuestionsArray);
                    if (selectedAnswer === 'Yes' && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[0]);
                    } else if (selectedAnswer === 'No' && nextQuestionsArray.length >= 2) {
                        newQuestionIDs.push(nextQuestionsArray[1]);
                    }
                } else {
                    newQuestionIDs.push(...currentQuestion.nextQuestions.split(',').map(q => q.trim()));
                }
            }
        });
        setCurrentQuestionIDs(newQuestionIDs);
        setQuestionHistory(prevHistory => [...prevHistory, newQuestionIDs]); // Update history with new question IDs
    };

    const handlePreviousQuestion = () => {
        if (questionHistory.length > 1) {
            const newHistory = [...questionHistory];
            newHistory.pop(); // Remove the current question IDs
            const previousQuestionIDs = newHistory[newHistory.length - 1];
            setCurrentQuestionIDs(previousQuestionIDs); // Set the previous question IDs from the history
            setQuestionHistory(newHistory); // Update history
        }
    };

    const currentQuestions = questions.filter(q => currentQuestionIDs.includes(q.questionID));

    if (!currentQuestions.length) {
        return <div>Loading...</div>;
    }

    const handleAnswerChange = (questionID, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionID]: answer,
        }));
    };

    const handleMultipleSelectChange = (questionID, option, isChecked) => {
        setAnswers(prevAnswers => {
            const prevAnswer = prevAnswers[questionID] || [];
            let updatedAnswer;
            if (isChecked) {
                updatedAnswer = [...prevAnswer, option];
            } else {
                updatedAnswer = prevAnswer.filter(ans => ans !== option);
            }
            return {
                ...prevAnswers,
                [questionID]: updatedAnswer,
            };
        });
    };

    const saveResults = async () => {
        const userEmail = localStorage.getItem('email'); // Retrieve email from local storage
        try {
            const formattedAnswers = Object.keys(answers).map(questionID => ({
                questionID,
                answer: answers[questionID]
            }));

            const response = await fetch('https://confess-data-tool-backend.vercel.app/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ examName, examCategory, userEmail, answers: formattedAnswers })
            });

            if (response.ok) {
                alert("Your answers are submitted");
                navigate('/landing'); // Redirect to dashboard after saving results
            } else {
                const errorData = await response.json();
                console.error('Failed to save results', errorData);
                alert(`Failed to save results: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error saving results:', error);
        }
    };

    const renderQuestionInput = (question) => {
        const savedAnswer = answers[question.questionID];
        switch (question.questionType) {
            case 'MCQ':
                return (
                    <>
                        {question.options.filter(option => option).map((option, index) => (
                            <div key={index} className='fs-5'>
                                <input
                                    type="radio"
                                    className='m-1 form-check-input'
                                    name={`question-${question.questionID}`}
                                    value={option}
                                    checked={savedAnswer === option}
                                    onChange={() => handleAnswerChange(question.questionID, option)}
                                />
                                {option}
                            </div>
                        ))}
                    </>
                );
            case 'Multiple Select':
                return (
                    <>
                        {question.options.filter(option => option).map((option, index) => (
                            <div key={index} className='fs-5'>
                                <input
                                    type="checkbox"
                                    className='m-1 form-check-input'
                                    name={`question-${question.questionID}`}
                                    value={option}
                                    checked={savedAnswer && savedAnswer.includes(option)}
                                    onChange={(e) => handleMultipleSelectChange(question.questionID, option, e.target.checked)}
                                />
                                {option}
                            </div>
                        ))}
                    </>
                );
            case 'Short':
            case 'Long Text':
                return (
                    <textarea
                        className='input-4 border-secondary text-secondary w-100'
                        name={`question-${question.questionID}`}
                        value={savedAnswer || ''}
                        onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
                    />
                );
            case 'Numerical Value':
                return (
                    <input
                        type="text"
                        className='input-4 border-secondary text-secondary w-100'
                        name={`question-${question.questionID}`}
                        value={savedAnswer || ''}
                        onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className='assessment-page container mt-5 py-5'>
            <h4>{examName}</h4>
            {currentQuestions.map(question => (
                <div key={question.questionID} className='question text-start'>
                    <p className='mt-5' dangerouslySetInnerHTML={{ __html: question.question }}></p>
                    {renderQuestionInput(question)}
                </div>
            ))}
            <div className='navigation-buttons d-flex justify-content-between mt-5'>
                <button
                    className='btn-cancel'
                    onClick={() => {
                        if (questionHistory.length <= 1) {
                            navigate('/instructions', { state: { examName, examCategory } });
                        } else {
                            handlePreviousQuestion();
                        }
                    }}
                >
                    {questionHistory.length <= 1 ? 'Cancel' : 'Previous'}
                </button>
                {currentQuestionIDs.includes(questions[questions.length - 1].questionID) ? (
                    <button
                        className='btn-cancel'
                        onClick={saveResults}
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        className='btn-cancel'
                        onClick={handleNextQuestion}
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}

export default AssessmentPage;
