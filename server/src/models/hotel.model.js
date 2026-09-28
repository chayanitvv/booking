const mongoose = require('mongoose');

// Embedded Schema สำหรับประเภทห้องพัก
const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Suite', 'Family', 'Villa']
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  description: String,
  images: [String]
}, { _id: true });

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: String,
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    country: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere' // รองรับ GeoSpatial Queries สำหรับค้นหาตามระยะทาง
    }
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Pool', 'Parking', 'Gym', 'Restaurant', 'Spa', 'Breakfast', 'AirConditioning']
  }],
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  rooms: [roomSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);