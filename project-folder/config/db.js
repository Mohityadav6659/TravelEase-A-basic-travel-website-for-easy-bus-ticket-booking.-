const mysql = require("mysql2");

// Create a connection pool to manage multiple queries efficiently
const pool = mysql.createConnection({
  host: "localhost",
  user: "root", // replace with your MySQL username
  password: "Mohit@6659", // replace with your MySQL password
  database: "bus_booking_system", // replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool; // Export pool with Promises enabled for async/await
