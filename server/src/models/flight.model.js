const mongoose = require('mongoose');

// Embedded Schema สำหรับที่นั่ง
const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    trim: true
  },
  seatClass: {
    type: String,
    required: true,
    enum: ['Economy', 'Premium Economy', 'Business', 'First']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  airline: {
    type: String,
    required: true,
    trim: true
  },
  departure: {
    airportCode: { type: String, required: true, uppercase: true, trim: true },
    airportName: String,
    city: { type: String, required: true },
    time: { type: Date, required: true }
  },
  arrival: {
    airportCode: { type: String, required: true, uppercase: true, trim: true },
    airportName: String,
    city: { type: String, required: true },
    time: { type: Date, required: true }
  },
  durationMinutes: Number,
  seats: [seatSchema]
}, {
  timestamps: true
});

// Compound Index สำหรับค้นหาเที่ยวบินได้เร็ว
flightSchema.index({ 'departure.city': 1, 'arrival.city': 1, 'departure.time': 1 });

module.exports = mongoose.model('Flight', flightSchema);