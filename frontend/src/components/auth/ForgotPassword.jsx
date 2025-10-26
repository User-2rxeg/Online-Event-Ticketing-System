import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setIsSubmitted(true);
                showToast.success('Password reset instructions sent to your email');
            } else {
                showToast.error(result.error);
            }
        } catch (error) {
            showToast.error('An error occurred while processing your request');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <h2>Check Your Email</h2>
                    <p>We've sent password reset instructions to {email}</p>
                    <div className="auth-links">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>
                <div className="auth-links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
