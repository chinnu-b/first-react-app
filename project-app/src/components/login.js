import React from 'react'
import { CustomNavigate } from '../util/navigate';
export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.status == 'failed') {
                setErrorMessage(data.message)
            } else {
                setErrorMessage('')
                localStorage.setItem('userId', data.user._id);
                localStorage.setItem('token', data.user.token);
                // redirect to dashboard
                CustomNavigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div className="auth-inner">
            <form onSubmit={handleSubmit}>
                <h3>Sign In</h3>
                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        name='email'
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        name='password'
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* show error message if there is any error message*/}
                <p className='text-danger'>
                    {errorMessage}
                </p>
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary-custom mt-2" disabled={!email || !password}>
                        Submit
                    </button>
                </div>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        </div>

    )
}
