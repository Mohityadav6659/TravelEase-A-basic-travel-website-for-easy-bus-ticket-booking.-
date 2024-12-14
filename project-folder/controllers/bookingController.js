const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Handle journey planning (search for trips)
exports.planJourney = (req, res) => {
  const { from, to, date } = req.body;

  const query = `
    SELECT * FROM trips 
    WHERE from_city = ? AND to_city = ? AND travel_date = ?
  `;
  const values = [from, to, date];

  db.execute(query, values, (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.render("plan", {
        title: "Plan Your Journey",
        trips: [],
        message: "An error occurred while fetching trip data.",
      });
    }

    if (results.length === 0) {
      return res.render("plan", {
        title: "Plan Your Journey",
        trips: [],
        message: "No trips found for the selected route and date.",
      });
    }
    // console.log(results);

    res.render("plan", {
      title: "Plan Your Journey",
      trips: results,
      message: null,
    });
  });
};

// Function to handle the bookTrip route
exports.bookTrip = (req, res) => {
  const tripId = req.params.trip_id; // Fetch the tripId from the URL

  // Log the trip ID for debugging
  // console.log("Trip ID:", tripId);

  // Query to get the trip details based on the tripId
  const query = `SELECT * FROM trips WHERE trip_id = ?`;
  db.execute(query, [tripId], (err, results) => {
    if (err) {
      console.error(err);
      return res.render("error", { message: "Error fetching trip details." });
    }

    if (results.length === 0) {
      return res.render("error", { message: "Trip not found." });
    }

    // console.log(results);

    const trip = results[0]; // Get the trip details
    res.render("booking", { title: "Booking", trip }); // Render the booking page with trip details
  });
};

// Handle booking form submission (complete booking)
exports.completeBooking = (req, res) => {
  const { tripId, name, email, passengers } = req.body;

  // console.log(req.body);

  // Generate a unique booking ID
  const bookingId = uuidv4();

  const query = `
    INSERT INTO bookings (booking_id, trip_id, customer_name, customer_email, passengers)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [bookingId, tripId, name, email, passengers];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error saving booking to the database: ", err);
      return res
        .status(500)
        .send("An error occurred while processing your booking.");
    }

    res.render("confirmation", {
      title: "Booking Confirmation",
      bookingId,
      tripId,
      name,
      email,
      passengers,
    });
  });
};

// Handle booking confirmation
exports.confirmBooking = (req, res) => {
  const { bookingId } = req.body;

  const query = `SELECT * FROM bookings WHERE booking_id = ?`;
  db.execute(query, [bookingId], (err, results) => {
    if (err || results.length === 0) {
      return res.render("error", { message: "Booking not found." });
    }

    const booking = results[0];
    res.render("confirmation", {
      title: "Booking Confirmation",
      booking,
    });
  });
};

// Handle booking management
exports.manageBooking = (req, res) => {
  const { bookingId } = req.body;

  // Query to find booking by ID
  const query = `SELECT 
    b.booking_id,
    b.customer_name,
    b.customer_email,
    b.passengers,
    b.booking_date,
    t.trip_id,
    t.from_city,
    t.to_city,
    t.travel_date,
    t.departure_time,
    t.arrival_time,
    t.price,
    t.seats_available
FROM 
    bookings AS b
JOIN 
    trips AS t ON b.trip_id = t.trip_id
WHERE 
    b.booking_id = ?`;
  db.execute(query, [bookingId], (err, results) => {
    if (err || results.length === 0) {
      // If no booking is found, render the page with an error message
      return res.render("manage", {
        title: "Manage My Booking",
        booking: null,
        message: "Booking not found.",
      });
    }

    // If booking is found, get the booking details
    const booking = results[0];
    // console.log(results);

    // Render the page with the booking details
    res.render("manage", {
      title: "Manage My Booking",
      message: null,
      booking,
    });
  });
};
