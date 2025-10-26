import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Common.css';

const Unauthorized = () => {
    const { user } = useAuth();

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <h1>Access Denied</h1>
                <p>You don't have permission to access this page.</p>

                {user ? (
                    <div className="unauthorized-actions">
                        <Link to="/" className="primary-button">
                            Return to Home
                        </Link>
                    </div>
                ) : (
                    <div className="unauthorized-actions">
                        <Link to="/login" className="primary-button">
                            Login
                        </Link>
                        <Link to="/register" className="secondary-button">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Unauthorized;
