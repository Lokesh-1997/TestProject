import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AssessmentPage.css';

function AssessmentPage() {
    const { state } = useLocation();
    const { examName, examCategory } = state || {};
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const [currentQuestionID, setCurrentQuestionID] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${examName}/questions`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                    if (data.length > 0) {
                        setCurrentQuestionID(data[0].questionID); // Set the first question ID as the current
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
        const currentQuestion = questions.find(q => q.questionID === currentQuestionID);
        if (currentQuestion && currentQuestion.nextQuestions) {
            setCurrentQuestionID(currentQuestion.nextQuestions);
        }
    };

    const handlePreviousQuestion = () => {
        const currentIndex = questions.findIndex(q => q.questionID === currentQuestionID);
        if (currentIndex > 0) {
            setCurrentQuestionID(questions[currentIndex - 1].questionID);
        }
    };

    const currentQuestion = questions.find(q => q.questionID === currentQuestionID);

    if (!currentQuestion) {
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
                alert("Your answers are submitted")
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


    if (!questions.length) {
        return <div>Loading...</div>;
    }

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
            <div className='question text-start'>
                <p dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p>
                {renderQuestionInput(currentQuestion)}
            </div>
            <div className='navigation-buttons d-flex justify-content-between mt-5'>
                <button
                    className='btn-cancel'
                    onClick={() => {
                        if (questions.findIndex(q => q.questionID === currentQuestionID) === 0) {
                            navigate('/instructions', { state: { examName, examCategory } });
                        } else {
                            handlePreviousQuestion();
                        }
                    }}
                >
                    {questions.findIndex(q => q.questionID === currentQuestionID) === 0 ? 'Cancel' : 'Previous'}
                </button>
                {questions.findIndex(q => q.questionID === currentQuestionID) === questions.length - 1 ? (
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
