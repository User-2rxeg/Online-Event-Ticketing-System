import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Spinner />;
    }

    // Not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleBasedRoute;
