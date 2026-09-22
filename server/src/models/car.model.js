const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: Number,
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Economy', 'Sedan', 'SUV', 'Luxury', 'Van']
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'],
    default: 'Automatic'
  },
  seatsCount: {
    type: Number,
    default: 5
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    branchName: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: String
  },
  status: {
    type: String,
    enum: ['Available', 'Rented', 'Maintenance', 'Inactive'],
    default: 'Available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);