const User = require("../Models/User");
const Booking = require("../Models/Booking");
const Event = require("../Models/Event");
const error = require("../Authentication/error");
// Admin: list all users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        next(err);
    }
};

// Admin: get user by id
exports.getUserById = async (req, res, next) => {
    try {
        const u = await User.findById(req.params.id);
        if (!u) { res.status(404); throw new Error("User not found"); }
        res.json(u);
    } catch (err) {
        next(err);
    }
};

// Admin: update user role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const u = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );
        if (!u) { res.status(404); throw new Error("User not found"); }
        res.json(u);
    } catch (err) {
        next(err);
    }
};

// Admin: delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const u = await User.findByIdAndDelete(req.params.id);
        if (!u) { res.status(404); throw new Error("User not found"); }
        res.json({ message: "User deleted" });
    } catch (err) {
        next(err);
    }
};

// Auth: current user's profile
exports.getProfile = (req, res) => {
    res.json(req.user);
};

// Auth: update profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, profilePicture, password } = req.body;
        if (password) req.user.password = password;
        if (name !== undefined) req.user.name = name;
        if (profilePicture !== undefined) req.user.profilePicture = profilePicture;
        await req.user.save();
        res.json(req.user);
    } catch (err) {
        next(err);
    }
};

// Standard: current user's bookings
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("event");
        res.json(bookings);
    } catch (err) {
        next(err);
    }
};

// Organizer: current user's events
exports.getMyEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        next(err);
    }
};

// Organizer: analytics (percentage booked per event)
exports.getMyEventsAnalytics = async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.user._id });
        const analytics = events.map(e => {
            const sold = e.totalTickets - e.ticketsRemaining;
            const pct = e.totalTickets > 0 ? Math.round((sold / e.totalTickets) * 100) : 0;
            return {
                eventId: e._id,
                title: e.title,
                totalTickets: e.totalTickets,
                ticketsRemaining: e.ticketsRemaining,
                sold,
                percentBooked: pct
            };
        });
        res.json(analytics);
    } catch (err) {
        next(err);
    }
};
