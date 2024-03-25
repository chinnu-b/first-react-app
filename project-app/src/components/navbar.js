import { AuthContext } from '../util/authProvider';
import React, { useContext, useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';



export const Navbar = () => {
    const {  setIsLoggedIn, setIsAdmin } = useContext(AuthContext);
    let isAdmin = sessionStorage.getItem('isAdmin');
    let isLoggedIn = localStorage.getItem('token') ? true : false;


    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
        sessionStorage.clear();
        isAdmin = false;
        isLoggedIn = false; 
        toast.success('Logged out successfully');

    }
    return (
        <><div>
            <ToastContainer />
        </div>
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to={'/login'}>
                        My App
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav ml-auto">
                            {!isLoggedIn && <li className="nav-item">
                                <Link className="nav-link" to={'/login'}>
                                    Login
                                </Link>
                            </li>}
                            {!isLoggedIn && <li className="nav-item">
                                <Link className="nav-link" to={'/sign-up'}>
                                    Sign up
                                </Link>
                            </li>}

                            {isLoggedIn && <li className="nav-item">
                                <Link className="nav-link" to={'/dashboard'}>
                                    Dashboard
                                </Link>
                            </li>}
                            {isLoggedIn &&!isAdmin && <li className="nav-item">
                                <Link className="nav-link" to={'/my-portfolio'}>
                                    My protfolio
                                </Link>
                            </li>}
                            {isAdmin && isLoggedIn && <li className="nav-item">
                                <Link className="nav-link" to={'/requests'}>
                                    Request manage
                                </Link>
                            </li>}
                            {isAdmin && isLoggedIn && <li className="nav-item">
                                <Link className="nav-link" to={'/users'}>
                                    User manage 
                                </Link>
                            </li>}
                            {isLoggedIn && isLoggedIn && <li className="nav-item">
                                <Link className="nav-link" to={'/payment-history'}>
                                    Payment history
                                </Link>
                            </li>}
                            {isLoggedIn && <li className="nav-item">
                                <Link className="nav-link" to={'/feedback'}>
                                    Feedback
                                </Link>
                            </li>}

                            {isLoggedIn && <li className="nav-item">
                                <Link className="nav-link ml-75" to={'/login'} onClick={handleLogout}>
                                    Logout
                                </Link>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav></>
    )
}
