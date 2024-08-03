
import { Outlet, Navigate } from 'react-router-dom'
import React, { useState, createContext, useContext } from 'react';


const PrivateRoutes = () => {

const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    React.useEffect(() => {
        const validateUser = async () => await verifyToken(localStorage.getItem('token'), localStorage.getItem('userId'));
        let userAuth = validateUser();
        if (userAuth) {
            setIsLoggedIn(true)
            setIsLoading(false)
        } else {
            setIsLoading(false)
        }
    }, [])
    return(
        isLoading ? <h1>Loading...</h1> : isLoggedIn ? <Outlet /> : <Navigate to='/login' />
    )

}
export const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch('https://fyl-service.vercel.app/api/getUserByUserId', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 'success') {
                        setIsLoggedIn(true);
                        setIsAdmin(data.user.isAdmin);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoading(false));
        }


    }, []);
    return (
        // <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }}>

        // </AuthContext.Provider>
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }}>
            {isLoading ? <h1>Loading...</h1> : {children}}
        </AuthContext.Provider>
    )


};

const verifyToken = async (token, userId) => {
    console.log('api called');
    if (token) {
        fetch('https://fyl-service.vercel.app/api/verifyToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, userId })
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

