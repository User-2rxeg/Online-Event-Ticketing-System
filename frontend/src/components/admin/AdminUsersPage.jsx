import React, { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import Spinner from '../common/Spinner';
import './Admin.css';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminApi.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            showToast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await adminApi.updateUserRole(userId, newRole);
            showToast.success('User role updated successfully');
            setShowRoleModal(false);
            fetchUsers();
        } catch (error) {
            showToast.error('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await adminApi.deleteUser(userId);
            showToast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            showToast.error('Failed to delete user');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Manage Users</h2>
            </div>

            <div className="admin-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="user">User</option>
                                        <option value="organizer">Organizer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;
