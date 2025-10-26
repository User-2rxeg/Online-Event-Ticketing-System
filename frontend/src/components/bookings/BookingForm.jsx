import React, { useState } from 'react';
import { bookingApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { formatPrice } from '../../utils/helpers';
import './Booking.css';

const BookingForm = ({ event, availability, onBookingComplete }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const maxTickets = event.totalTickets - event.bookedTickets;
    const totalPrice = quantity * event.price;

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= maxTickets) {
            setQuantity(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await bookingApi.create(event._id, { quantity });
            showToast.success(`Successfully booked ${quantity} ticket(s)!`);
            onBookingComplete();
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Failed to book tickets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
                <label htmlFor="quantity">Number of Tickets</label>
                <div className="quantity-selector">
                    <button
                        type="button"
                        onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                        className="quantity-btn"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={maxTickets}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => quantity < maxTickets && setQuantity(q => q + 1)}
                        className="quantity-btn"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="price-summary">
                <div className="price-details">
                    <p>Price per ticket: {formatPrice(event.price)}</p>
                    <p>Quantity: {quantity}</p>
                    <p className="total-price">Total: {formatPrice(totalPrice)}</p>
                </div>
            </div>

            <button
                type="submit"
                className="book-button"
                disabled={loading || quantity > maxTickets}
            >
                {loading ? 'Processing...' : 'Book Now'}
            </button>

            {availability.status === 'LIMITED' && (
                <p className="availability-warning">
                    {availability.message}
                </p>
            )}
        </form>
    );
};

export default BookingForm;
