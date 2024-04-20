//start dashboard.js code
// dashboard will have a welcome message
// if an user is to make a payment, he will see dummy payment interface
// if not pay

import React, { useContext } from 'react';
import { AuthContext } from '../util/authProvider';
import { toast, ToastContainer } from 'react-toastify';

export default function Dashboard() {
    //initialise authcontext
    const { isAdmin, setIsAdmin } = useContext(AuthContext);
    const [user, setUser] = React.useState([]);
    const [amount, setAmount] = React.useState('');
    const [account, setAccount] = React.useState('');
    const [welcomeMessage, setWelcomeMessage] = React.useState('');
    React.useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch('https://first-react-app-server.onrender.com/api/getUserByUserId', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 'success') {
                        setWelcomeMessage(`Welcome ${data.user.firstName}`);
                        setUser(data.user);
                    }
                })
                .catch(err => console.error(err));
        }
    }, []);
    const makePayment = () => {
        fetch('https://first-react-app-server.onrender.com/api/makePayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, amount, account, userName: user.firstName})
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    toast.success('Payment made successfully');
                    setUser({ ...user, paymentRequested: false });
                }
            })
            .catch(err => console.error(err));
    }
    const sendRequestToAdmin = () => {
        fetch('https://first-react-app-server.onrender.com/api/sendRequestToAdmin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status == 'success') {
                    toast.success('Request sent to admin');
                    setUser({ ...user, requestSentToAdmin: true, waitingForPortfolio: true});
                }
            })
            .catch(err => console.error(err));
    }   
    return (
        <div className='dashboard'>
            <ToastContainer />
            <h3>{welcomeMessage}</h3>
            {user.paymentRequested ? <div className='w-25 m-auto'>
                <h3>Payment</h3>
                <p>Payment is pending. Admin has requested you to make payment.</p>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" className="form-control" id="amount"
                        onChange={(e) => setAmount(e.target.value)} /> 
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="account">Account</label>
                    <input type="text" className="form-control" id="account"
                        onChange={(e) => setAccount(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-success mt-4" disabled={!amount || !account}
                onClick={makePayment}
                >Pay</button>
            </div> :
                user.status === 'Pending' ? !user.requestSentToAdmin ? user.waitingForPortfolio ?
                    <div className='w-75 m-auto'>
                        <h3>Waiting...</h3>
                        <p>Payment successfull</p>
                        <p>Waiting for admin to create portfolio</p>
                    </div>
                :<div className='w-75 m-auto'>
                    <h3>Request</h3>
                    <p>Request to admin to create portfolio</p>
                    <button className='btn btn-success' onClick={sendRequestToAdmin}>Send request</button>
                </div>
                 :<div className='w-75 m-auto'>
                    <h3>Waiting...</h3>
                    <p>Request waiting with admin to create portfolio</p>
                </div> : <div>Nothing to show here</div>}
        </div>
    )
}
