import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import EventCard from './EventCard';
import ConfirmationDialog from '../common/ConfirmationDialog';
import Spinner from '../common/Spinner';
import './Events.css';

const MyEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteEventId, setDeleteEventId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventApi.getMyEvents();
            setEvents(response.data);
        } catch (error) {
            showToast.error('Failed to fetch your events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteEventId) return;

        try {
            await eventApi.delete(deleteEventId);
            showToast.success('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            showToast.error('Failed to delete event');
        } finally {
            setDeleteEventId(null);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="my-events-container">
            <div className="page-header">
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
                    <button
                        onClick={() => navigate('/my-events/new')}
                        className="create-event-btn"
                    >
                        Create Your First Event
                    </button>
                </div>
            ) : (
                <div className="events-grid">
                    {events.map(event => (
                        <div key={event._id} className="event-card-container">
                            <EventCard event={event} />
                            <div className="event-actions">
                                <button
                                    onClick={() => navigate(`/my-events/${event._id}/edit`)}
                                    className="edit-btn"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => navigate(`/my-events/${event._id}/analytics`)}
                                    className="analytics-btn"
                                >
                                    Analytics
                                </button>
                                <button
                                    onClick={() => setDeleteEventId(event._id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="event-status">
                                Status: <span className={`status-badge ${event.status.toLowerCase()}`}>
                                    {event.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationDialog
                isOpen={!!deleteEventId}
                onClose={() => setDeleteEventId(null)}
                onConfirm={handleDelete}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
};

export default MyEventsPage;
