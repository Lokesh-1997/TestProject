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


    return (<>
        <nav className="navbar navbar-expand-lg bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/landing">
                    <img src={LogoLight} alt='logo' width={200} />
                </a>
                <button className="navbar-toggler btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* Toggle menu */}
                <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Confess-data-tool-Menu</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <a className="dropdown-item" aria-current="page" href="/landing">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="dropdown-item" href="/reports">Dashboard</a>
                            </li>
                            {currentUser?.role === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <a className="dropdown-item" href="/assessment">Assessments</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="dropdown-item" href="/results">Reports</a>
                                    </li>
                                </>
                            )}
                            <li className="nav-item dropdown">
                                <a className="dropdown-item dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Language
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="nav-item">
                                        <a className="dropdown-item" href="#">English</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="dropdown-item" href="#">German</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <a className="dropdown-item logout-btn" onClick={handleLogout}>Logout</a>
                            </li>
                        </ul>

                    </div>
                </div>
                {/* Normal menu */}
                <div className="d-none d-lg-block">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Language
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">English</a></li>
                                <li><a className="dropdown-item" href="#">German</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="dropdown-item logout-btn" onClick={handleLogout}>Logout</a>
                        </li>
                    </ul>

                </div>

            </div>
        </nav>



    </>
    );
}

export default NavSection;