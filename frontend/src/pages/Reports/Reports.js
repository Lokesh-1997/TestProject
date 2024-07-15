import React, { useEffect, useState } from 'react';
import './Reports.css';
import { useNavigate } from 'react-router-dom';

function Reports() {
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);
    const [totalTurnover, setTotalTurnover] = useState(0);
    const [totalCapex, setTotalCapex] = useState(0);
    const [totalOpex, setTotalOpex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');

        if (email) {
            fetch(`https://confess-data-tool-backend.vercel.app/api/dashboard?email=${email}`)
                .then(response => response.json())
                .then(data => {
                    setUsers(data.users);
                    setResults(data.results);
                    let turnover = 0;
                    let capex = 0;
                    let opex = 0;

                    data.results.forEach(result => {
                        result.answers.forEach(answer => {
                            if (answer.questionCategory === 'Turnover') {
                                turnover += parseFloat(answer.answer[0]) || 0;
                            } else if (answer.questionCategory === 'CapEx') {
                                capex += parseFloat(answer.answer[0]) || 0;
                            } else if (answer.questionCategory === 'OpEx') {
                                opex += parseFloat(answer.answer[0]) || 0;
                            }
                        });
                    });
                    setTotalTurnover(turnover);
                    setTotalCapex(capex);
                    setTotalOpex(opex);

                    // Check if all filtered answers have non-empty values
                    const hasUnansweredQuestions = data.results.some(result => {
                        const filteredAnswers = result.answers.filter(answer => answer.questionType !== "Blank");
                        return !filteredAnswers.every(answer => answer.answer.some(ans => ans.trim() !== ''));
                    });

                    if (hasUnansweredQuestions) {
                        alert("Not all answered");
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, []);

    const ChartDetails = [
        {
            title: "Turnover",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            text1: "Aligned",
            text2: "Not aligned but eligible",
            text3: "Not eligible"
        },
        {
            title: "CapEx",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            text1: "Aligned",
            text2: "Not aligned but eligible",
            text3: "Not eligible"
        },
        {
            title: "OpEx",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            text1: "Aligned",
            text2: "Not aligned but eligible",
            text3: "Not eligible"
        },
        {
            title: "# of Activities",
            topic: "EU Taxonomy alignment for Clean Energy Activities",
            text1: "Aligned",
            text2: "Not aligned but eligible",
            text3: "Not eligible"
        }
    ];

    const ActivitiesDetails = [
        {
            title: "Energy Activity 1 - Electricity generation using solar photovoltaic technology",
            text1: ["Substential Contribution (Climate Change Mitigation)", "darkgreen-dot"],
            text2: ["Climate Change Adaptation", "darkgreen-dot"],
            text3: ["Water and Marine Protection", "orage-dot"],
            text4: ["Circular Economy", "darkgreen-dot"],
            text5: ["Pollution Prevention", "darkgreen-dot"],
            text6: ["Biodiversity", "darkgreen-dot"]
        },
        {
            title: "Energy Activity 2 - Electricity generation using solar photovoltaic technology",
            text1: ["Substential Contribution (Climate Change Mitigation)", "darkgreen-dot"],
            text2: ["Climate Change Adaptation", "orage-dot"],
            text3: ["Water and Marine Protection", "darkgreen-dot"],
            text4: ["Circular Economy", "darkgreen-dot"],
            text5: ["Pollution Prevention", "darkgreen-dot"],
            text6: ["Biodiversity", "orage-dot"]
        },
        {
            title: "Energy Activity 3 - Electricity generation using solar photovoltaic technology",
            text1: ["Substential Contribution (Climate Change Mitigation)", "darkgrey-dot"],
            text2: ["Climate Change Adaptation", "darkgreen-dot"],
            text3: ["Water and Marine Protection", "darkgreen-dot"],
            text4: ["Circular Economy", "darkgreen-dot"],
            text5: ["Pollution Prevention", "darkgrey-dot"],
            text6: ["Biodiversity", "darkgreen-dot"]
        }
    ];

    return (
        <div className='d-flex justify-content-center mt-5'>
            <section className='reports-main'>
                <div className="card card-reports">
                    <div className="card-header text-start">
                        <h3 className='fw-light'>Report: CONFESS</h3>
                        {users.map((val, index) => {
                            const capitalizeName = (name) => {
                                return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                            };
                            return <p key={index}>For {capitalizeName(val.name)}</p>;
                        })}
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.</i>
                        </p>
                        <p className="card-title mt-3">Total Number of Activities: <span>{results.length}</span></p>
                        <p className="mt-3">Total Turnover: {totalTurnover} $ <br />Total CapEx: {totalCapex} $ <br /> Total OpEx: {totalOpex} $</p>
                    </div>
                </div>

                <section className='section-card'>
                    {ChartDetails.map((value, index) => (
                        <div key={index} className='card-main'>
                            <div className="card card-stats mt-5">
                                <div className="card-body text-start">
                                    <h3>{value.title}</h3>
                                    <p className="card-title">{value.topic}</p>
                                    <div className="circle m-4">
                                        <div className="circle-progress"></div>
                                    </div>
                                    <div className='row d-flex flex-column justify-content-bet align-items-center'>
                                        <div className='col d-flex justify-content-between'>
                                            <p>Aligned</p>
                                            <p>600 $ (60%)</p>
                                        </div>
                                        <div className='col d-flex justify-content-between'>
                                            <p>Not aligned but eligible</p>
                                            <p>600 $ (60%)</p>
                                        </div>
                                        <div className='col d-flex justify-content-between'>
                                            <p>Not eligible</p>
                                            <p>600 $ (60%)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="card card-reports mt-5">
                    <div className="card-header text-start">
                        <h3 className='fw-light'>Activities in Detail</h3>
                    </div>
                    <div className="card-body text-start">
                        <p className="card-title">
                            <i>Disclaimer: The evaluation is based on the information provided in the tool. No verifications were conducted.</i>
                        </p>
                        <p>Legend</p>
                        <div className='col'>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgreen-dot'></span>Criteria met</p>
                            <p className="mt-3 d-flex align-items-center"><span className='orage-dot'></span>Criteria not met</p>
                            <p className="mt-3 d-flex align-items-center"><span className='darkgrey-dot'></span>Criteria not assessable</p>
                        </div>
                    </div>
                </div>


                <section>
                    {results.map((value) => {
                        const filteredAnswers = value.answers.filter(answer => answer.questionType !== "Blank");
                        return (
                            <div key={value._id} className="card card-reports mt-5 text-start">
                                <div className="card-header">
                                    <h3 className='fw-light'>{value.examCategory} Activity 1 - {value.examName}</h3>
                                </div>
                                <div className="card-body">
                                    {filteredAnswers.map(answer => (
                                        <div key={answer._id}>
                                            <h5>{answer.questionCategory}</h5>
                                            <p>Type: {answer.questionType}</p>
                                            <p>Answer: {answer.answer.join(", ")}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>


                <section>
                    {ActivitiesDetails.map((value, index) => (
                        <div key={index} className="card card-reports mt-5 text-start">
                            <div className="card-header">
                                <h3 className='fw-light'>{value.title}</h3>
                            </div>
                            <div className='d-flex mx-3 mt-3 justify-content-between'>
                                <p>{value.text1[0]}</p>
                                <span className={`${value.text1[1]} mx-4`}></span>
                            </div>
                            <p className="mx-3 mt-4">Do No Significant Harm</p>
                            <div className='d-flex mx-3 mt-2 justify-content-between'>
                                <p>{value.text2[0]}</p>
                                <span className={`${value.text2[1]} mx-4`}></span>
                            </div>
                            <div className='d-flex mx-3 justify-content-between'>
                                <p>{value.text3[0]}</p>
                                <span className={`${value.text3[1]} mx-4`}></span>
                            </div>
                            <div className='d-flex mx-3 justify-content-between'>
                                <p>{value.text4[0]}</p>
                                <span className={`${value.text4[1]} mx-4`}></span>
                            </div>
                            <div className='d-flex mx-3 justify-content-between'>
                                <p>{value.text5[0]}</p>
                                <span className={`${value.text5[1]} mx-4`}></span>
                            </div>
                            <div className='d-flex mx-3 justify-content-between'>
                                <p>{value.text6[0]}</p>
                                <span className={`${value.text6[1]} mx-4`}></span>
                            </div>
                        </div>
                    ))}
                </section>
            </section>
        </div>
    );
}

export default Reports;
