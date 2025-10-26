import React from 'react';
import { formatDate, formatPrice } from '../../utils/helpers';
import './Bookings.css';

const BookingDetails = ({ booking, onClose, isModal = true }) => {
    if (!booking) return null;

    const content = (
        <div className={`booking-details-content ${isModal ? 'modal' : ''}`}>
            <div className="booking-details-header">
                <h2>{booking.event.title}</h2>
                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                </span>
            </div>

            <div className="booking-info-grid">
                <div className="info-group">
                    <h3>Event Details</h3>
                    <p><strong>Date:</strong> {formatDate(booking.event.date)}</p>
                    <p><strong>Location:</strong> {booking.event.location}</p>
                    <p><strong>Organizer:</strong> {booking.event.organizer.name}</p>
                </div>

                <div className="info-group">
                    <h3>Booking Information</h3>
                    <p><strong>Booking ID:</strong> {booking._id}</p>
                    <p><strong>Booking Date:</strong> {formatDate(booking.createdAt)}</p>
                    <p><strong>Number of Tickets:</strong> {booking.quantity}</p>
                    <p><strong>Price per Ticket:</strong> {formatPrice(booking.event.price)}</p>
                    <p><strong>Total Amount:</strong> {formatPrice(booking.totalPrice)}</p>
                </div>

                {booking.event.description && (
                    <div className="info-group full-width">
                        <h3>Event Description</h3>
                        <p>{booking.event.description}</p>
                    </div>
                )}
            </div>

            {isModal && (
                <div className="booking-details-actions">
                    <button onClick={onClose} className="close-button">
                        Close
                    </button>
                </div>
            )}
        </div>
    );

    if (isModal) {
        return (
            <div className="booking-details-modal">
                <div className="modal-overlay" onClick={onClose}></div>
                {content}
            </div>
        );
    }

    return content;
};

export default BookingDetails;
