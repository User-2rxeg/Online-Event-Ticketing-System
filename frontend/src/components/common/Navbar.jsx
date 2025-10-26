import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Event Ticketing</Link>
            </div>

            <div className="nav-links">
                {/* Public Links */}
                <Link to="/events">Events</Link>

                {!user ? (
                    /* Guest Links */
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    /* Authenticated User Links */
                    <>
                        {user.role === 'user' && (
                            <Link to="/bookings">My Bookings</Link>
                        )}

                        {user.role === 'organizer' && (
                            <>
                                <Link to="/my-events">My Events</Link>
                                <Link to="/my-events/new">Create Event</Link>
                                <Link to="/my-events/analytics">Analytics</Link>
                            </>
                        )}

                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/events">Manage Events</Link>
                                <Link to="/admin/users">Manage Users</Link>
                            </>
                        )}

                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
