const router = require("express").Router();
const { auth, requireRole } = require("../Authentication/Authentication");
const {
    getUsers, getUserById, updateUserRole, deleteUser,
    getProfile, updateProfile, getMyBookings, getMyEvents, getMyEventsAnalytics
} = require("../Controllers/User-Controller");

// Admin

router.get("/:id", auth(), requireRole("admin"), getUserById);
router.put("/:id", auth(), requireRole("admin"), updateUserRole);
router.delete("/:id", auth(), requireRole("admin"), deleteUser);

// Authenticated user profile
router.get("/profile", auth(), getProfile);
router.put("/profile", auth(), updateProfile);

// Standard user bookings
router.get("/bookings", auth(), requireRole("standard"), getMyBookings);

// Organizer events + analytics
router.get("/events", auth(), requireRole("organizer"), getMyEvents);
router.get("/events/analytics", auth(), requireRole("organizer"), getMyEventsAnalytics);

module.exports = router;


// TESTED ALL USER ROUTES:
// Get User by ID: ()
// Update User Role: ()
// Delete User: ()
// Get Profile: ()
// Update Profile: ()
// Get My Bookings: ()
// Get My Events: ()
// Get My Events Analytics: ()


