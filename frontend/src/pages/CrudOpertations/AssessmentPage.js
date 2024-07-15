import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AssessmentPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';

function AssessmentPage() {
    const { state } = useLocation();
    const { examName, examCategory } = state || {};
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const [currentQuestionIDs, setCurrentQuestionIDs] = useState([]);
    const [questionHistory, setQuestionHistory] = useState([]);
    const [savedOptions, setSavedOptions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/assessments/${examName}/questions`);
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(data);
                    if (data.length > 0) {
                        setCurrentQuestionIDs([data[0].questionID]);
                        setQuestionHistory([[data[0].questionID]]);
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

    // console.log(savedOptions);

    const handleNextQuestion = () => {
        const newQuestionIDs = [];
        let addHello = false;
        let savedque = [];

        // console.log(savedque);

        currentQuestionIDs.forEach(id => {
            const currentQuestion = questions.find(q => q.questionID === id);
            const answer = '';


            // Alert
            if (
                currentQuestion &&
                ['MCQ', 'Multiple Select', 'Short', 'Long Text', 'Numerical Value'].includes(currentQuestion.questionType) &&
                currentQuestion.alertText && // Check if alertText key exists
                (
                    (currentQuestion.questionType === 'MCQ' && !answer) ||
                    (currentQuestion.questionType === 'Multiple Select' && (!answer || answer.length === 0)) ||
                    ((currentQuestion.questionType === 'Short' || currentQuestion.questionType === 'Long Text') && !answer) ||
                    (currentQuestion.questionType === 'Numerical Value' && answer === '')
                )
            ) {
                alert(currentQuestion.alertText); // Show alert with the value of alertText
            }
            // alert end


            if (currentQuestion && currentQuestion.nextQuestions) {
                console.log(currentQuestion.alertText);
                if (currentQuestion.questionType === 'MCQ' && currentQuestion.options.includes('Yes') && currentQuestion.options.includes('No')) {
                    let selectedAnswer = answers[currentQuestion.questionID];
                    if (!selectedAnswer) {
                        selectedAnswer = 'Yes';
                    }
                    const nextQuestionsArray = currentQuestion.nextQuestions.split(',').map(q => q.trim());
                    if (selectedAnswer === 'Yes' && nextQuestionsArray.length >= 1) {
                        newQuestionIDs.push(nextQuestionsArray[0]);
                    } else if (selectedAnswer === 'No' && nextQuestionsArray.length >= 2) {
                        newQuestionIDs.push(nextQuestionsArray[1]);
                    }
                } else {
                    newQuestionIDs.push(...currentQuestion.nextQuestions.split(',').map(q => q.trim()));
                }
            }
            const prevQuestion = questions.find(q => q.questionID === id);
            if (prevQuestion && prevQuestion.questionType === 'Multiple Select') {
                addHello = true; // Set flag to true to add Hello to the next question
                const savedOptionsForCurrentQuestion = savedOptions[prevQuestion.questionID];

                if (savedOptionsForCurrentQuestion && savedOptionsForCurrentQuestion.length > 0) {
                    savedque = savedOptionsForCurrentQuestion.map(opt => opt.value1 || opt.value0);


                }
            }
        });
        setCurrentQuestionIDs(newQuestionIDs);
        setQuestionHistory(prevHistory => [...prevHistory, newQuestionIDs]);

        if (addHello && newQuestionIDs.length > 0) {
            const nextQuestionID = newQuestionIDs[0];
            const nextQuestionIndex = questions.findIndex(q => q.questionID === nextQuestionID);

            if (nextQuestionIndex !== -1) {
                const nextQuestion = questions[nextQuestionIndex];
                console.log(savedque);
                // Split the savedque values by comma, trim whitespace, and remove duplicates
                const allValues = savedque.flatMap(item => item.split('¦').map(s => s.trim()));
                const uniqueValues = Array.from(new Set(allValues));
                console.log(allValues);
                // Combine the unique values into a string with <li> tags
                const combinedSavedque = uniqueValues.map(item => `<li>${item}</li>`).join(' ');
                // Append the combinedSavedque to the next question's question
                nextQuestion.question = `${nextQuestion.question} ${combinedSavedque}`;
                // Update the questions state
                setQuestions([...questions]);
                // Clear saved options
                setSavedOptions('');
            }
        }

    };

    const handlePreviousQuestion = () => {
        if (questionHistory.length > 1) {
            const newHistory = [...questionHistory];
            newHistory.pop();
            const previousQuestionIDs = newHistory[newHistory.length - 1];
            setCurrentQuestionIDs(previousQuestionIDs);
            setQuestionHistory(newHistory);
            // setSavedOptions('')
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

    const handleMultipleSelectChange = (questionID, optionValue0, optionValue1, isChecked) => {
        setAnswers(prevAnswers => {
            const prevAnswer = prevAnswers[questionID] || [];
            let updatedAnswer;
            if (isChecked) {
                updatedAnswer = [...prevAnswer, { value0: optionValue0, value1: optionValue1 }];
            } else {
                updatedAnswer = prevAnswer.filter(ans => ans.value0 !== optionValue0);
            }
            return {
                ...prevAnswers,
                [questionID]: updatedAnswer,
            };
        });

        // Only add to savedOptions if value1 is present
        if (optionValue1) {
            setSavedOptions(prevSavedOptions => {
                const prevOptions = prevSavedOptions[questionID] || [];
                let updatedOptions;
                if (isChecked) {
                    updatedOptions = [...prevOptions, { value0: optionValue0, value1: optionValue1 }];
                } else {
                    updatedOptions = prevOptions.filter(opt => opt.value0 !== optionValue0);
                }
                return {
                    ...prevSavedOptions,
                    [questionID]: updatedOptions,
                };
            });
        }
    };


    console.log(currentQuestions);


    const saveResults = async () => {
        const userEmail = localStorage.getItem('email');
        try {
            // Loop through each question in currentQuestions
            const formattedAnswers = currentQuestions.map(currentQuestion => {
                const currentquestionId = currentQuestion.questionID;
                const currentAnswer = answers[currentquestionId];
                const questionCategory = currentQuestion.questionCategory;

                // Format the answer appropriately
                if (Array.isArray(currentAnswer)) {
                    return {
                        questionID: currentquestionId,
                        questionCategory,
                        answer: currentAnswer.length > 0 ? currentAnswer.map(a => `${a.value0},${a.value1}`).join(';') : ''
                    };
                } else {
                    return {
                        questionID: currentquestionId,
                        questionCategory,
                        answer: currentAnswer || ''
                    };
                }
            });

            // Send the data to the backend
            const response = await fetch('https://confess-data-tool-backend.vercel.app/api/results/submitresults', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ examName, examCategory, userEmail, answers: formattedAnswers })
            });

            if (response.ok) {
                alert("Your answers are submitted");
                navigate('/landing');
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
        const prevSavedOptions = savedOptions[question.questionID];
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
                        {question.options.filter(option => option).map((option, index) => {
                            const optionValue = option.split('#');

                            return (
                                <div key={index} className='fs-5'>
                                    <input
                                        type="checkbox"
                                        className='m-1 form-check-input'
                                        name={`question-${question.questionID}`}
                                        value={optionValue[0]}
                                        checked={savedAnswer && savedAnswer.some(ans => ans.value0 === optionValue[0])}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleMultipleSelectChange(question.questionID, optionValue[0], optionValue[1], isChecked);
                                        }}
                                    />
                                    {optionValue[0]}
                                </div>
                            );
                        })}

                        {/* {prevSavedOptions && prevSavedOptions.length > 0 && (
                            <p className='saved-options'>
                                Saved Options: {prevSavedOptions.map(opt => opt.value1).join(', ')}
                            </p>
                        )} */}
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
                    <div className='numerical'>
                        <input
                            type="number"
                            className='input-4 border-secondary text-secondary w-100'
                            name={`question-${question.questionID}`}
                            value={savedAnswer || ''}
                            onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={faEuroSign}
                            className='euro-sign'
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const isLastQuestion = currentQuestions.some(question => question.nextQuestions === 'end');

    return (
        <div className='assessment-page container mt-5 py-5'>
            <h4>{examName}</h4>
            {currentQuestions.map(question => (
                <div key={question.questionID} className='question text-start'>
                    <p className='mt-5' dangerouslySetInnerHTML={{ __html: question.question }}></p>
                    {renderQuestionInput(question)}
                    <p className='mt-3'><i>{question.disclaimer}</i></p>
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
                {isLastQuestion ? (
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