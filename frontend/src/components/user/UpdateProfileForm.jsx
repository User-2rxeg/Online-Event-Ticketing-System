import React, { useState } from 'react';
import { userApi } from '../../utils/api';
import { showToast } from '../../utils/toast';

const UpdateProfileForm = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password is required to change password';
            }
            if (formData.newPassword && formData.newPassword.length < 6) {
                newErrors.newPassword = 'New password must be at least 6 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Update profile data
            const updateData = {
                name: formData.name
            };

            await userApi.updateProfile(updateData);

            // If password fields are filled, update password
            if (formData.currentPassword && formData.newPassword) {
                await userApi.changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                });
            }

            showToast.success('Profile updated successfully');
            onUpdate?.();

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="password-section">
                <h3>Change Password</h3>
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={errors.currentPassword ? 'error' : ''}
                    />
                    {errors.currentPassword && (
                        <span className="error-message">{errors.currentPassword}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={errors.newPassword ? 'error' : ''}
                        minLength={6}
                    />
                    {errors.newPassword && (
                        <span className="error-message">{errors.newPassword}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && (
                        <span className="error-message">{errors.confirmPassword}</span>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="update-profile-btn"
                disabled={loading}
            >
                {loading ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    );
};

export default UpdateProfileForm;
