import React, { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { formatDate } from '../../utils/helpers';
import Spinner from '../common/Spinner';
import './Admin.css';

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await adminApi.getEventRequests();
            setEvents(response.data);
        } catch (error) {
            showToast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (eventId) => {
        try {
            await adminApi.approveEvent(eventId);
            showToast.success('Event approved successfully');
            fetchEvents();
        } catch (error) {
            showToast.error('Failed to approve event');
        }
    };

    const handleReject = async (eventId) => {
        try {
            await adminApi.rejectEvent(eventId);
            showToast.success('Event rejected successfully');
            fetchEvents();
        } catch (error) {
            showToast.error('Failed to reject event');
        }
    };

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        return event.status.toLowerCase() === filter;
    });

    if (loading) return <Spinner />;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Manage Events</h2>
                <div className="filter-controls">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Events</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="admin-table">
                <table>
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Organizer</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(event => (
                            <tr key={event._id}>
                                <td>{event.title}</td>
                                <td>{event.organizer.name}</td>
                                <td>{formatDate(event.date)}</td>
                                <td>{event.location}</td>
                                <td>
                                    <span className={`status-badge ${event.status.toLowerCase()}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="action-buttons">
                                    {event.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(event._id)}
                                                className="approve-btn"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(event._id)}
                                                className="reject-btn"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminEventsPage;
