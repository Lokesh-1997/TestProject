import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoLight from "../../asset/logo_light.png";
import '../LandingPage.css';
import './Navbar.css';

function NavSection() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/users`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error('Failed to fetch users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/admin`);
                if (response.ok) {
                    const data = await response.json();
                    setAdmins(data);
                } else {
                    console.error('Failed to fetch admins');
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };
        fetchAdmins();
    }, []);

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            const user = users.find(user => user.email === email);
            const admin = admins.find(admin => admin.email === email);


            if (user) {
                setCurrentUser({ ...user, role: 'user' });
            } else if (admin) {
                setCurrentUser({ ...admin, role: 'admin' });
            }
        } else {
            navigate('/login');
        }
    }, [users, admins, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        navigate('/login');
    };


    // Total calculations


    const [results, setResults] = useState([]);
    const [totalTurnover, setTotalTurnover] = useState(0);
    const [totalCapex, setTotalCapex] = useState(0);
    const [totalOpex, setTotalOpex] = useState(0);

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
                        // alert("Not all answered");
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, []);


    console.log(totalTurnover);
    console.log(totalCapex);
    console.log(totalOpex);

    

    return (
        <nav className="navbar navbar-expand-lg darkmode">
            <div className="container">
                <a className="navbar-brand Landing-main" href="#">
                    <img src={LogoLight} alt='logo' />
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className='d-flex justify-content-around align-items-center w-100'>
                        <div>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/landing">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/reports">Dashboard</a>
                                </li>
                                {currentUser?.role === 'admin' && (
                                    <>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/assessment">Assessments</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/results">Reports</a>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                        <div>
                            <ul className='navbar-nav'>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavSection;
