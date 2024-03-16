import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/signup';
import Dashboard from './components/dashboard';
import { PrivateRoutes } from './components/authProvider';
import React, { useContext, useRef, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from './components/authProvider';
function App() {
  const [isLoggedIn, logout] = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
  }
  
  return (
    <><div>
       <ToastContainer/>
    </div>
    <Router>
      <div className="App" >
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/login'}>
              {/* rename it later */}
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
                {/* show logout at the right side */}
                {isLoggedIn && <li className="nav-item">
                  <Link className="nav-link ml-75" to={'/login'} onClick={handleLogout}>
                    Logout
                  </Link>
                </li>}
              </ul>
            </div>
          </div>
        </nav>
        <div className="wrapper">

          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </div>
      </div>
      <div>
      </div>
    </Router></>
  )
}
export default App
