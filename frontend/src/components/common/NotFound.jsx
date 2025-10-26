import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css';

const NotFound = () => {
    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for doesn't exist or has been moved.</p>
                <div className="unauthorized-actions">
                    <Link to="/" className="primary-button">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
