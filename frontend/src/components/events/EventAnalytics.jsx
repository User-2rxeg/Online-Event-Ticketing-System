import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer
} from 'recharts';
import { eventApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { formatDate, formatPrice } from '../../utils/helpers';
import Spinner from '../common/Spinner';
import './Events.css';

const EventAnalytics = () => {
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEventData();
    }, [id]);

    const fetchEventData = async () => {
        try {
            const response = await eventApi.getAnalytics(id);
            setEventData(response.data);
        } catch (error) {
            showToast.error('Failed to fetch event analytics');
            navigate('/my-events');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;
    if (!eventData) return null;

    const {
        title,
        totalTickets,
        bookedTickets,
        revenue,
        bookingHistory,
        dailyBookings
    } = eventData;

    const ticketStatusData = [
        { name: 'Booked', value: bookedTickets },
        { name: 'Available', value: totalTickets - bookedTickets }
    ];

    const COLORS = ['#0088FE', '#00C49F'];

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h2>{title} - Analytics</h2>
                <button
                    onClick={() => navigate('/my-events')}
                    className="back-button"
                >
                    Back to Events
                </button>
            </div>

            <div className="analytics-summary">
                <div className="summary-card">
                    <h3>Total Revenue</h3>
                    <p className="highlight">{formatPrice(revenue)}</p>
                </div>
                <div className="summary-card">
                    <h3>Tickets Sold</h3>
                    <p className="highlight">{bookedTickets} / {totalTickets}</p>
                    <p className="percentage">
                        {((bookedTickets / totalTickets) * 100).toFixed(1)}%
                    </p>
                </div>
                <div className="summary-card">
                    <h3>Remaining Tickets</h3>
                    <p className="highlight">{totalTickets - bookedTickets}</p>
                </div>
            </div>

            <div className="analytics-charts">
                {/* Ticket Distribution Pie Chart */}
                <div className="chart-container">
                    <h3>Ticket Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={ticketStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {ticketStatusData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Daily Bookings Line Chart */}
                <div className="chart-container">
                    <h3>Daily Booking Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyBookings}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => formatDate(date, 'short')}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="bookings"
                                stroke="#8884d8"
                                name="Tickets Booked"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Booking History */}
                <div className="recent-bookings">
                    <h3>Recent Bookings</h3>
                    <div className="bookings-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Tickets</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingHistory.map((booking) => (
                                    <tr key={booking._id}>
                                        <td>{formatDate(booking.createdAt)}</td>
                                        <td>{booking.user.name}</td>
                                        <td>{booking.quantity}</td>
                                        <td>{formatPrice(booking.totalPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventAnalytics;
