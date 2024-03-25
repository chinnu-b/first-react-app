import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/signup';
import Dashboard from './components/dashboard';
import { PrivateRoutes } from './util/authProvider';
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from './components/navbar';
import { AuthContext } from './util/authProvider';
import { useState } from 'react';
import Portfolio from './components/Portfolio';
import RequestManage from './components/requests';
import UserManage from './components/users';
import PaymentHistory from './components/payments';
import Feedback from './components/feedback';
import EditUser from './components/edituser';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  return (
    <>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }}>
        <div className="App" >
          <Router>
          <Navbar />
              <div className="wrapper">
                <Routes>
                  <Route exact path="/" element={<Login />} />
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/sign-up" element={<SignUp />} />
                  <Route element={<PrivateRoutes />}>
                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/my-portfolios" element={<Portfolio />} />
                    <Route exact path="/requests" element={<RequestManage />} />
                    <Route exact path="/users" element={<UserManage />} />
                    <Route exact path="/payment-history" element={<PaymentHistory />} />
                    <Route exact path="/feedback" element={<Feedback />} />
                    <Route exact path="/users/:id" element={<EditUser />} />
                    <Route exact path="/my-portfolio" element={<Portfolio />} />
                  </Route>
                </Routes>
              </div>
          </Router>
        </div>
      </AuthContext.Provider>
    </>
  )
}
export default App
