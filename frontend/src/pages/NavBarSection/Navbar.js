import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoLight from "../../asset/logo_light.png";
import '../LandingPage.css';
import './Navbar.css';

function NavSection() {
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (!email) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <>
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
                                    <li className="nav-item">
                                        <a className="nav-link" href="/assessment">Assessments</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/results">Reports</a>
                                    </li>
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
        </>
    );
}

export default NavSection;
