// Date formatting
export const formatDate = (dateString) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Price formatting
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

// Ticket availability helpers
export const getTicketAvailability = (total, booked) => {
    const available = total - booked;
    if (available <= 0) {
        return { status: 'SOLD_OUT', message: 'Sold Out' };
    }
    if (available <= 5) {
        return { status: 'LIMITED', message: `Only ${available} tickets left` };
    }
    return { status: 'AVAILABLE', message: `${available} tickets available` };
};

// Input validation
export const validateEventForm = (eventData) => {
    const errors = {};

    if (!eventData.title?.trim()) {
        errors.title = 'Title is required';
    }

    if (!eventData.date) {
        errors.date = 'Date is required';
    } else if (new Date(eventData.date) < new Date()) {
        errors.date = 'Date cannot be in the past';
    }

    if (!eventData.location?.trim()) {
        errors.location = 'Location is required';
    }

    if (!eventData.totalTickets || eventData.totalTickets <= 0) {
        errors.totalTickets = 'Total tickets must be greater than 0';
    }

    if (!eventData.price || eventData.price < 0) {
        errors.price = 'Price must be 0 or greater';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
