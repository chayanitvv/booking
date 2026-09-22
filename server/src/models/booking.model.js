const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookingType: {
    type: String,
    required: true,
    enum: ['hotel', 'flight', 'car']
  },
  
  // รายละเอียดแบบ Dynamic ขึ้นอยู่กับประเภทการจอง
  hotelDetails: {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    roomId: { type: mongoose.Schema.Types.ObjectId },
    checkIn: { type: Date },
    checkOut: { type: Date },
    guestsCount: { type: Number, default: 1 }
  },

  flightDetails: {
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    selectedSeats: [{ type: String }],
    passengers: [{
      firstName: String,
      lastName: String,
      passportNo: String
    }]
  },

  carDetails: {
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    pickupDate: { type: Date },
    dropoffDate: { type: Date },
    pickupLocation: { type: String },
    dropoffLocation: { type: String }
  },

  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);