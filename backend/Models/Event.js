const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    image: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    totalTickets: {
        type: Number,
        required: true,
        min: 0
    },
    ticketsRemaining: {
        type: Number,
        required: true,
        min: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["approved", "pending", "declined"],
        default: "pending",
        index: true
    }
},
    { timestamps: true });

EventSchema.pre("save", function (next) {
    if (this.ticketsRemaining > this.totalTickets) this.ticketsRemaining = this.totalTickets;
    next();
});

EventSchema.index({ title: "text", description: "text", category: "text", location: "text" });


module.exports = mongoose.models.Event || mongoose.model("Event", EventSchema);



