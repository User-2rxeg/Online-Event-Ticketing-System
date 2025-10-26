import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { eventApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import EventForm from './EventForm';
import EventAnalytics from './EventAnalytics';
import Spinner from '../common/Spinner';
import './Events.css';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const response = await eventApi.getMyEvents();
            setEvents(response.data);
        } catch (error) {
            showToast.error('Failed to fetch your events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            await eventApi.delete(eventId);
            showToast.success('Event deleted successfully');
            fetchMyEvents();
        } catch (error) {
            showToast.error('Failed to delete event');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'status-badge approved';
            case 'pending': return 'status-badge pending';
            case 'declined': return 'status-badge declined';
            default: return 'status-badge';
        }
    };

    if (loading) return <Spinner />;

    return (
        <Routes>
            <Route path="/" element={
                <div className="my-events-container">
                    <div className="header-actions">
                        <h1>My Events</h1>
                        <button
                            onClick={() => navigate('/my-events/new')}
                            className="create-event-btn"
                        >
                            Create New Event
                        </button>
                    </div>

                    {events.length === 0 ? (
                        <div className="no-events">
                            <p>You haven't created any events yet.</p>
                        </div>
                    ) : (
                        <div className="events-table">
                            {events.map(event => (
                                <div key={event._id} className="event-row">
                                    <div className="event-info">
                                        <h3>{event.title}</h3>
                                        <p>{new Date(event.date).toLocaleDateString()}</p>
                                        <span className={getStatusBadgeClass(event.status)}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <div className="event-actions">
                                        <button
                                            onClick={() => navigate(`/my-events/${event._id}/analytics`)}
                                            className="analytics-btn"
                                        >
                                            Analytics
                                        </button>
                                        <button
                                            onClick={() => navigate(`/my-events/${event._id}/edit`)}
                                            className="edit-btn"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            } />
            <Route path="/new" element={<EventForm />} />
            <Route path="/:id/edit" element={<EventForm />} />
            <Route path="/:id/analytics" element={<EventAnalytics />} />
        </Routes>
    );
};

export default MyEvents;
