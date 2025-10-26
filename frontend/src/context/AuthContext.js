import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            setUser(response.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Logout failed'
            };
        }
    };

    const forgotPassword = async (email) => {
        try {
            await axios.post('/api/auth/forgot-password', { email });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Password reset request failed'
            };
        }
    };

    const updateProfile = async (userData) => {
        try {
            const response = await axios.put('/api/users/profile', userData);
            setUser(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            forgotPassword,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
