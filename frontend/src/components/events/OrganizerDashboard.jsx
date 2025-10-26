import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { formatDate, formatPrice } from '../../utils/helpers';
import EventCard from './EventCard';
import Spinner from '../common/Spinner';
import './Events.css';

const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrganizerData();
    }, []);

    const fetchOrganizerData = async () => {
        try {
            const [eventsResponse, statsResponse] = await Promise.all([
                eventApi.getMyEvents(),
                eventApi.getOrganizerStats()
            ]);
            setEvents(eventsResponse.data);
            setStatistics(statsResponse.data);
        } catch (error) {
            showToast.error('Failed to fetch organizer data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="organizer-dashboard">
            <div className="dashboard-header">
                <h1>Organizer Dashboard</h1>
                <button
                    onClick={() => navigate('/my-events/new')}
                    className="create-event-btn"
                >
                    Create New Event
                </button>
            </div>

            {statistics && (
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Events</h3>
                        <p className="stat-value">{statistics.totalEvents}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Tickets Sold</h3>
                        <p className="stat-value">{statistics.totalTicketsSold}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">{formatPrice(statistics.totalRevenue)}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Upcoming Events</h3>
                        <p className="stat-value">{statistics.upcomingEvents}</p>
                    </div>
                </div>
            )}

            <div className="dashboard-sections">
                {/* Upcoming Events Section */}
                <section className="event-section">
                    <h2>Upcoming Events</h2>
                    <div className="events-grid">
                        {events
                            .filter(event => new Date(event.date) > new Date())
                            .map(event => (
                                <div key={event._id} className="event-card-wrapper">
                                    <EventCard event={event} />
                                    <div className="event-actions">
                                        <button
                                            onClick={() => navigate(`/my-events/${event._id}/edit`)}
                                            className="edit-btn"
                                        >
                                            Edit Event
                                        </button>
                                        <button
                                            onClick={() => navigate(`/my-events/${event._id}/analytics`)}
                                            className="analytics-btn"
                                        >
                                            View Analytics
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>

                {/* Past Events Section */}
                <section className="event-section">
                    <h2>Past Events</h2>
                    <div className="events-grid">
                        {events
                            .filter(event => new Date(event.date) <= new Date())
                            .map(event => (
                                <div key={event._id} className="event-card-wrapper">
                                    <EventCard event={event} />
                                    <div className="event-actions">
                                        <button
                                            onClick={() => navigate(`/my-events/${event._id}/analytics`)}
                                            className="analytics-btn"
                                        >
                                            View Analytics
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
