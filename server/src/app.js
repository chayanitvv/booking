const express = require("express");
const cors = require("cors");
const trackRoutes = require("./routes/track.routes");
const authRoutes = require("./routes/auth.routes");
const flightRoutes = require("./routes/flight.routes");
const bookingRoutes = require("./routes/booking.routes");
const serviceBookingRoutes = require("./routes/service-booking.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// 1. Global middleware
app.use(cors());
app.use(express.json());

// 2. Routes
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/service-bookings", serviceBookingRoutes);

// 3. Error handling — must be LAST
app.use(notFound);
app.use(errorHandler);

module.exports = app;
