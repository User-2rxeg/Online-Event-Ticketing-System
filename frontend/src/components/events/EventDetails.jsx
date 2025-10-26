import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { formatDate, formatPrice, getTicketAvailability } from '../../utils/helpers';
import BookingForm from '../bookings/BookingForm';
import Spinner from '../common/Spinner';
import './Events.css';

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await eventApi.getById(id);
            setEvent(response.data);
        } catch (error) {
            showToast.error('Failed to fetch event details');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;
    if (!event) return null;

    const availability = getTicketAvailability(event.totalTickets, event.bookedTickets);
    const isOrganizer = user?.role === 'organizer' && user?._id === event.organizer;

    return (
        <div className="event-details-container">
            <div className="event-details-header">
                <h1>{event.title}</h1>
                {event.imageUrl && (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="event-details-image"
                    />
                )}
            </div>

            <div className="event-info">
                <h2>Event Details</h2>
                <p><strong>Date:</strong> {formatDate(event.date)}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Price:</strong> {formatPrice(event.price)}</p>
                <p><strong>Availability:</strong> {availability.message}</p>
                {event.description && (
                    <div className="event-description">
                        <h3>Description</h3>
                        <p>{event.description}</p>
                    </div>
                )}
            </div>

            {isOrganizer ? (
                <div className="organizer-controls">
                    <button
                        onClick={() => navigate(`/my-events/${event._id}/edit`)}
                        className="edit-event-btn"
                    >
                        Edit Event
                    </button>
                </div>
            ) : (
                availability.status !== 'SOLD_OUT' && user && (
                    <div className="booking-section">
                        <h2>Book Tickets</h2>
                        <BookingForm
                            event={event}
                            availability={availability}
                            onBookingComplete={fetchEventDetails}
                        />
                    </div>
                )
            )}

            {!user && availability.status !== 'SOLD_OUT' && (
                <div className="login-prompt">
                    <p>Please <a href="/login">log in</a> to book tickets for this event.</p>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
