const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Home Route
router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Plan Your Journey Route (GET)
router.get("/plan", (req, res) => {
  res.render("plan", { title: "Plan Your Journey", trips: [], message: null });
});

// Handle Plan Form Submission (POST)
router.post("/plan", bookingController.planJourney);

// Display booking form for selected trip (GET)
router.get("/book-trip/:trip_id", bookingController.bookTrip);

// Handle booking form submission (POST)
router.post("/complete-booking", bookingController.completeBooking);

// Confirm booking (POST)
router.post("/confirm-booking", bookingController.confirmBooking);

router.get("/help", (req, res) => {
  res.render("help", { title: "Help" });
});
// Manage My Booking Route (GET)
router.get("/manage", (req, res) => {
  res.render("manage", {
    title: "Manage My Booking",
    booking: null,
    message: null,
  });
});

// Handle Manage Booking (POST)
router.post("/manage", bookingController.manageBooking);

module.exports = router;
