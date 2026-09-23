const mongoose = require("mongoose");

// Don't queue queries while disconnected; fail fast with a real error instead.
mongoose.set("bufferCommands", false);

// Cache the connection promise across serverless invocations (Vercel reuses warm instances).
let connectionPromise = null;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
      .then(() => {
        console.log("MongoDB connected");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null; // allow a retry on the next request
        throw new Error(`MongoDB connection failed: ${error.message}`);
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
