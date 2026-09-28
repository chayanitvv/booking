require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/config/db");

let dbPromise;

module.exports = async (req, res) => {
  try {
    dbPromise = dbPromise || connectDB();
    await dbPromise;
  } catch (err) {
    dbPromise = null;
    console.error("DB connection failed:", err);
    return res.status(500).json({ message: "DB connection failed" });
  }
  return app(req, res);
};