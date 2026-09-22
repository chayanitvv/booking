const Booking = require('../models/booking.model');
const Flight = require('../models/flight.model');

const bookFlight = async (req, res, next) => {
  try {
    const { flightId, seatNumber, passenger } = req.body;
    if (!flightId || !seatNumber || !passenger?.firstName || !passenger?.lastName) {
      return res.status(400).json({ message: 'Flight, seat, and passenger name are required' });
    }

    const flight = await Flight.findById(flightId);
    const seat = flight?.seats.find((item) => item.seatNumber === seatNumber);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    if (seat.isBooked) return res.status(409).json({ message: 'This seat has already been booked' });

    seat.isBooked = true;
    await flight.save();
    const booking = await Booking.create({
      user: req.user._id,
      bookingType: 'flight',
      flightDetails: { flight: flight._id, selectedSeats: [seat.seatNumber], passengers: [passenger] },
      totalAmount: seat.price,
      status: 'confirmed',
    });

    res.status(201).json({ booking: { id: booking._id, status: booking.status, totalAmount: booking.totalAmount, flightNumber: flight.flightNumber, seatNumber: seat.seatNumber } });
  } catch (error) { next(error); }
};

module.exports = { bookFlight };
