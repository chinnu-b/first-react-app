
import { Outlet, Navigate } from 'react-router-dom'
import React, { useState, createContext } from 'react';


const PrivateRoutes = () => {
    // Logic to check if user is authenticated
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    if(!token || !userId) return <Navigate to="/login"/>
    const auth = verifyToken(token, userId);
    return(
        auth ? <Outlet/> : <Navigate to="/login"/>
    )
    
}
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const verifyToken = async (token, userId) => {
    if(token){
        fetch('http://localhost:4000/api/verifyToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, userId})
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 'failed') {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                return false;
            }
            return true;
        })
        .catch(err => console.error(err));
    }
}
export { PrivateRoutes }

