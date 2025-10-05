const router = require("express").Router();
const { auth, requireRole } = require("../Authentication/Authentication");
const {
    getApprovedEvents, getAllEvents, getEventById,
    createEvent, updateEvent, deleteEvent
} = require("../Controllers/Event-Controller");

// Public
router.get("/", getApprovedEvents);
router.get("/:id", getEventById);

// Admin: all events
router.get("/all", auth(), requireRole("admin"), getAllEvents);

// Organizer: CRUD
router.post("/", auth(), requireRole("organizer"), createEvent);
router.put("/:id", auth(), requireRole("organizer", "admin"), updateEvent);
router.delete("/:id", auth(), requireRole("organizer", "admin"), deleteEvent);

module.exports = router;


// TESTED ALL EVENT ROUTES:
// Get Approved Events: ()
// Get All Events (Admin): ()
// Get Event by ID: ()
// Create Event (Organizer): ()
// Update Event (Organizer/Admin): ()
// Delete Event (Organizer/Admin): ()