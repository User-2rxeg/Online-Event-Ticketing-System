const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({

        user:  {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true
        },
        event: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
                required: true,
                index: true
        },
        quantity: {
                type: Number,
                required: true,
                min: 1
        },
        totalPrice: {
                type: Number,
                required: true,
                min: 0
        },
        status: {
                type: String,
                enum: ["pending", "confirmed", "canceled"],
                default: "pending",
                index: true
        }
}, { timestamps: true });

BookingSchema.index({ user: 1, event: 1, status: 1 });


module.exports = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);


