import React, { Component } from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class SignUp extends Component {
        constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            errorMessage: ''
        };
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { email, password, firstName, lastName } = this.state;
        let { errorMessage } = this.state;

        event.preventDefault();
        try {
            const response = await fetch('https://first-react-app-server.onrender.com/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName })
            });
            const data = await response.json();
            if (data.status === 'failed') {
                errorMessage = data.message
            } else {
                errorMessage = ''
                toast.success('User registered successfully');
                //clear the form
                this.setState({ email: '', password: '', firstName: '', lastName: '' });
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
            }
        } catch (err) {
            console.error(err);
        }

    }
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };



    render() {
        const { email, password, firstName, lastName } = this.state;
        let { errorMessage } = this.state;
        return (
            <>
            <ToastContainer />
            <div className="auth-inner">
                <form onSubmit={this.handleSubmit}>
                    <h3>Sign Up</h3>
                    <div className="mb-3">
                        <label>First name</label>
                        <input
                            name='firstName'
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            onChange={this.handleChange}
                            required />
                    </div>
                    <div className="mb-3">
                        <label>Last name</label>
                        <input
                            name='lastName'
                            type="text"
                            className="form-control"
                            placeholder="Last name"
                            onChange={this.handleChange}
                            required />
                    </div>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            name='email'
                            className="form-control"
                            placeholder="Enter email"
                            onChange={this.handleChange}
                            required />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            name='password'
                            className="form-control"
                            placeholder="Enter password"
                            onChange={this.handleChange}
                            required />
                    </div>
                    <p className='text-danger'>{errorMessage}</p>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary-custom" disabled={!email || !password || !firstName || !lastName}>
                            Sign Up
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        Already registered <a href="/login">sign in?</a>
                    </p>
                </form>
            </div>
            </>
        )
    }
}