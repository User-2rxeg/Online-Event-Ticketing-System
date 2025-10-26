import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { formatDate, formatPrice } from '../../utils/helpers';
import Spinner from '../common/Spinner';
import './Bookings.css';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingApi.getUserBookings();
            setBookings(response.data);
        } catch (error) {
            showToast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await bookingApi.cancel(bookingId);
            showToast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            showToast.error('Failed to cancel booking');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="bookings-container">
            <h2>My Bookings</h2>

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-header">
                                <h3>{booking.event.title}</h3>
                                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="booking-details">
                                <p>
                                    <strong>Date:</strong> {formatDate(booking.event.date)}
                                </p>
                                <p>
                                    <strong>Location:</strong> {booking.event.location}
                                </p>
                                <p>
                                    <strong>Tickets:</strong> {booking.quantity}
                                </p>
                                <p>
                                    <strong>Total Price:</strong> {formatPrice(booking.totalPrice)}
                                </p>
                                <p>
                                    <strong>Booked On:</strong> {formatDate(booking.createdAt)}
                                </p>
                            </div>

                            {booking.status === 'CONFIRMED' && (
                                <div className="booking-actions">
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="cancel-booking-btn"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings;
