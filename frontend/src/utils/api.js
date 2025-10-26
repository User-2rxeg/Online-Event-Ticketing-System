import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth APIs
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}`, { password: newPassword }),
    getCurrentUser: () => api.get('/auth/me')
};

// User APIs
export const userApi = {
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.put('/users/change-password', data)
};

// Event APIs
export const eventApi = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
    getMyEvents: () => api.get('/events/my-events'),
    getAnalytics: (id) => api.get(`/events/${id}/analytics`),
    search: (query) => api.get('/events/search', { params: { query } })
};

// Booking APIs
export const bookingApi = {
    create: (eventId, data) => api.post(`/bookings/${eventId}`, data),
    getUserBookings: () => api.get('/bookings'),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.delete(`/bookings/${id}`)
};

// Admin APIs
export const adminApi = {
    getAllUsers: () => api.get('/admin/users'),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getEventRequests: () => api.get('/admin/events/pending'),
    approveEvent: (id) => api.put(`/admin/events/${id}/approve`),
    rejectEvent: (id) => api.put(`/admin/events/${id}/reject`)
};

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Redirect to login page if not authenticated
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
