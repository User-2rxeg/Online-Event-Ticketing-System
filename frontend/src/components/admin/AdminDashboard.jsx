import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminEventsPage from './AdminEventsPage';
import AdminUsersPage from './AdminUsersPage';
import './Admin.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <Routes>
                <Route path="/" element={<AdminEventsPage />} />
                <Route path="/events" element={<AdminEventsPage />} />
                <Route path="/users" element={<AdminUsersPage />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
