//start dashboard.js code
// dashboard will have a welcome message and a button to logout,
// when user clicks on logout, it will redirect to login page
// show user's first name in the welcome message
// list of users will be shown in the dashboard

import React, { Component } from 'react';
import { CustomNavigate } from '../util/navigate';
export default function Dashboard() {
    const [users, setUsers] = React.useState([]);
    const [welcomeMessage, setWelcomeMessage] = React.useState('');
    React.useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch('http://localhost:4000/api/getUserByUserId', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 'success') {
                        setWelcomeMessage(`Welcome ${data.user.firstName}`);
                    }
                })
                .catch(err => console.error(err));
        }
        fetch('http://localhost:4000/api/getUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    setUsers(data.users);
                }
            })
            .catch(err => console.error(err));
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('userId');
        CustomNavigate('/login');
    }
    return (
        <div className='dashboard'>
            <h3>{welcomeMessage}</h3>
            <button onClick={handleLogout}>Logout</button>
            <h3>List of users</h3>
            <ul>
                {users.map(user => <li key={user._id}>{user.firstName} {user.lastName}</li>)}
            </ul>
        </div>
    )
}
