import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import './Events.css';

const EventCard = ({ event }) => {
    const getAvailabilityStatus = () => {
        const available = event.totalTickets - event.bookedTickets;
        if (available === 0) {
            return <span className="sold-out">Sold Out</span>;
        } else if (available <= 5) {
            return <span className="limited">Only {available} tickets left!</span>;
        }
        return <span className="available">{available} tickets available</span>;
    };

    return (
        <div className="event-card">
            <div className="event-image">
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} />
                ) : (
                    <div className="placeholder-image">No Image</div>
                )}
            </div>
            <div className="event-content">
                <h3>{event.title}</h3>
                <div className="event-details">
                    <p className="event-date">{formatDate(event.date)}</p>
                    <p className="event-location">{event.location}</p>
                    <p className="event-price">${event.price.toFixed(2)}</p>
                </div>
                <div className="event-availability">
                    {getAvailabilityStatus()}
                </div>
                <Link to={`/events/${event._id}`} className="view-details-btn">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EventCard;
