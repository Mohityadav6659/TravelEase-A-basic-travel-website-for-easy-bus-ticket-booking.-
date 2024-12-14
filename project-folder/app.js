const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// MySQL Connection
const db = require("./config/db");

// Route Imports
const indexRouter = require("./routes/index");

// Set View Engine
app.set("view engine", "ejs");

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));

// Use Routes
app.use("/", indexRouter);

// Listen on Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
