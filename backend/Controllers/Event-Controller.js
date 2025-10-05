const Event = require("../Models/Event");
const error = require("../Authentication/error");
// Public: get approved events
exports.getApprovedEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ status: "approved" }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        next(err);
    }
};

// Admin: all events (any status)
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (err) {
        next(err);
    }
};

// Public: single event by id
exports.getEventById = async (req, res, next) => {
    try {
        const e = await Event.findById(req.params.id);
        if (!e) { res.status(404); throw new Error("Event not found"); }
        res.json(e);
    } catch (err) {
        next(err);
    }
};

// Organizer: create event (defaults to pending)
exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, date, location, category, image, price, totalTickets } = req.body;
        const e = await Event.create({
            title, description, date, location, category, image,
            price,
            totalTickets,
            ticketsRemaining: totalTickets,
            organizer: req.user._id,
            status: "pending"
        });
        res.status(201).json(e);
    } catch (err) {
        next(err);
    }
};

// Organizer or Admin: update event
exports.updateEvent = async (req, res, next) => {
    try {
        const e = await Event.findById(req.params.id);
        if (!e) { res.status(404); throw new Error("Event not found"); }

        // Organizer can only update their own events (date, location, totalTickets, etc.)
        const isOrganizerOwner = req.user.role === "organizer" && e.organizer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";
        if (!isOrganizerOwner && !isAdmin) {
            res.status(403);
            throw new Error("Forbidden");
        }

        const permitted = ["title","description","date","location","category","image","price","totalTickets"];
        for (const k of permitted) {
            if (req.body[k] !== undefined) e[k] = req.body[k];
        }

        // Keep remaining within bounds if totalTickets changed
        if (req.body.totalTickets !== undefined && e.ticketsRemaining > e.totalTickets) {
            e.ticketsRemaining = e.totalTickets;
        }

        // Admin can set status (approve/decline/pending)
        if (isAdmin && req.body.status) {
            e.status = req.body.status;
        }

        await e.save();
        res.json(e);
    } catch (err) {
        next(err);
    }
};

// Organizer or Admin: delete event
exports.deleteEvent = async (req, res, next) => {
    try {
        const e = await Event.findById(req.params.id);
        if (!e) { res.status(404); throw new Error("Event not found"); }

        const isOrganizerOwner = req.user.role === "organizer" && e.organizer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";
        if (!isOrganizerOwner && !isAdmin) {
            res.status(403);
            throw new Error("Forbidden");
        }

        await e.deleteOne();
        res.json({ message: "Event deleted" });
    } catch (err) {
        next(err);
    }
};
