import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UpdateProfileForm from './UpdateProfileForm';
import Spinner from '../common/Spinner';
import './Profile.css';

const UserProfile = () => {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user) return null;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>My Profile</h2>

                <div className="role-info">
                    <p><strong>Account Type:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>

                <UpdateProfileForm user={user} />
            </div>
        </div>
    );
};

export default UserProfile;
