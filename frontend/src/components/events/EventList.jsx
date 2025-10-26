import React, { useState, useEffect } from 'react';
import { eventApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import EventCard from './EventCard';
import Spinner from '../common/Spinner';
import './Events.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        date: '',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventApi.getAll();
            setEvents(response.data);
        } catch (error) {
            showToast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                            event.location.toLowerCase().includes(filters.search.toLowerCase());
        const matchesDate = !filters.date || event.date.includes(filters.date);
        const matchesMinPrice = !filters.minPrice || event.price >= Number(filters.minPrice);
        const matchesMaxPrice = !filters.maxPrice || event.price <= Number(filters.maxPrice);

        return matchesSearch && matchesDate && matchesMinPrice && matchesMaxPrice;
    });

    if (loading) return <Spinner />;

    return (
        <div className="events-container">
            <div className="filters-section">
                <input
                    type="text"
                    name="search"
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
            </div>

            {filteredEvents.length === 0 ? (
                <div className="no-events">
                    <p>No events found matching your criteria</p>
                </div>
            ) : (
                <div className="events-grid">
                    {filteredEvents.map(event => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
