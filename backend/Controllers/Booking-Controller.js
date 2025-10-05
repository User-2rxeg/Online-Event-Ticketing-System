const mongoose = require("mongoose");
const Booking = require("../Models/Booking");
const Event = require("../Models/Event");
const error = require("../Authentication/error");

// POST /api/v1/bookings  (Standard)
exports.createBooking = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { eventId, quantity } = req.body;
        const event = await Event.findOneAndUpdate(
            { _id: eventId, ticketsRemaining: { $gte: quantity }, status: "approved" },
            { $inc: { ticketsRemaining: -quantity } },
            { new: true, session }
        );
        if (!event) {
            res.status(400);
            throw new Error("Event not found / not approved / insufficient tickets");
        }

        const totalPrice = quantity * event.price;
        const booking = await Booking.create(
            [{ user: req.user._id, event: event._id, quantity, totalPrice, status: "confirmed" }],
            { session }
        );

        await session.commitTransaction();
        res.status(201).json(booking[0]);
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
};

// GET /api/v1/bookings/:id  (Standard – own booking)
exports.getBookingById = async (req, res, next) => {
    try {
        const b = await Booking.findById(req.params.id).populate("event");
        if (!b) { res.status(404); throw new Error("Booking not found"); }
        if (b.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            res.status(403); throw new Error("Forbidden");
        }
        res.json(b);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/v1/bookings/:id  (Standard – own booking) -> cancel & release tickets
exports.cancelBooking = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const b = await Booking.findById(req.params.id).session(session);
        if (!b) { res.status(404); throw new Error("Booking not found"); }
        if (b.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            res.status(403); throw new Error("Forbidden");
        }
        if (b.status === "canceled") {
            await session.commitTransaction();
            return res.json({ message: "Booking already canceled" });
        }

        // Release tickets
        await Event.findByIdAndUpdate(
            b.event,
            { $inc: { ticketsRemaining: b.quantity } },
            { session }
        );

        b.status = "canceled";
        await b.save({ session });

        await session.commitTransaction();
        res.json({ message: "Booking canceled" });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
};
