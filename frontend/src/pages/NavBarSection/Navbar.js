import React from 'react';
import LogoLight from "../../asset/logo_light.png";
import '../LandingPage.css';
import './Navbar.css';



function NavSection() {
    return (
        <>
            <nav class="navbar navbar-expand-lg darkmode ">
                <div class="container">
                    <a class="navbar-brand Landing-main" href="#">
                        <img src={LogoLight} alt='logo' />
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <div className='d-flex justify-content-around align-items-center w-100'>
                            <div>
                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <a class="nav-link active" aria-current="page" href="/landing">Home</a>
                                    </li>
                                    <li class="nav-item ">
                                        <a class="nav-link" href="/reports">Dashboard</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/assessment">Assessments</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/">Reports</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul className='navbar-nav'>
                                    {/* <li className='navbar-nav'>
                                        <FontAwesomeIcon icon={faUser} />
                                    </li> */}
                                    <li class="nav-item">
                                        <a class="nav-link" href="#" >Logout</a>
                                    </li>

                                </ul>

                            </div>

                        </div>
                    </div>

                </div>

                {/* <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked />
                    <label class="btn btn-outline-secondary" for="btnradio1">Dark Theme</label>

                    <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
                    <label class="btn btn-outline-light" for="btnradio2">Light Theme</label>

                </div> */}

            </nav>
        </>
    )
}

export default NavSection