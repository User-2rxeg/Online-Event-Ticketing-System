import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { validateEventForm } from '../../utils/helpers';
import Spinner from '../common/Spinner';
import './Events.css';

const EventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(id ? true : false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        totalTickets: '',
        price: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (id) {
            fetchEventData();
        }
    }, [id]);

    const fetchEventData = async () => {
        try {
            const response = await eventApi.getById(id);
            const event = response.data;
            setFormData({
                title: event.title,
                description: event.description || '',
                date: new Date(event.date).toISOString().split('T')[0],
                location: event.location,
                totalTickets: event.totalTickets,
                price: event.price,
                imageUrl: event.imageUrl || ''
            });
        } catch (error) {
            showToast.error('Failed to fetch event data');
            navigate('/my-events');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateEventForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);

        try {
            if (id) {
                await eventApi.update(id, formData);
                showToast.success('Event updated successfully');
            } else {
                await eventApi.create(formData);
                showToast.success('Event created successfully');
            }
            navigate('/my-events');
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="event-form-container">
            <h2>{id ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <label htmlFor="title">Event Title*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date and Time*</label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location*</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={errors.location ? 'error' : ''}
                    />
                    {errors.location && <span className="error-message">{errors.location}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="totalTickets">Total Tickets*</label>
                        <input
                            type="number"
                            id="totalTickets"
                            name="totalTickets"
                            value={formData.totalTickets}
                            onChange={handleChange}
                            min="1"
                            className={errors.totalTickets ? 'error' : ''}
                        />
                        {errors.totalTickets && <span className="error-message">{errors.totalTickets}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price per Ticket*</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className={errors.price ? 'error' : ''}
                        />
                        {errors.price && <span className="error-message">{errors.price}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/my-events')} className="cancel-btn">
                        Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                        {id ? 'Update Event' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
