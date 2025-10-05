const router = require("express").Router();
const { auth, requireRole } = require("../Authentication/Authentication");
const { createBooking, getBookingById, cancelBooking } = require("../Controllers/Booking-Controller");

// Standard user
router.post("/", auth(), requireRole("standard"), createBooking);
router.get("/:id", auth(), requireRole("standard", "admin"), getBookingById);
router.delete("/:id", auth(), requireRole("standard", "admin"), cancelBooking);

module.exports = router;

// TESTED ALL BOOKING ROUTES:
// CreateBooking: ()
// GetBookingById: ()
// CancelBooking: ()