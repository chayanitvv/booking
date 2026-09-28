const ServiceBooking = require('../models/service-booking.model');

const createReference = () => `SJ${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;

const createServiceBooking = async (req, res, next) => {
  try {
    const { item, paymentMethod } = req.body;
    if (!item?.kind || !item?.name || !item?.place || !Number.isFinite(item.price) || !paymentMethod) {
      return res.status(400).json({ message: 'Booking and payment details are required' });
    }
    const booking = await ServiceBooking.create({
      reference: createReference(),
      customer: { user: req.user._id, name: `${req.user.profile.firstName} ${req.user.profile.lastName}`, email: req.user.email, phone: req.user.profile.phone },
      serviceType: item.kind,
      serviceName: item.name,
      location: item.place,
      serviceDetails: item.details || [],
      totalAmount: item.price,
      paymentMethod,
      paymentStatus: paymentMethod === 'ชำระที่เคาน์เตอร์' ? 'pending' : 'paid',
      bookingStatus: paymentMethod === 'ชำระที่เคาน์เตอร์' ? 'pending' : 'confirmed'
    });
    res.status(201).json({ booking });
  } catch (error) { next(error); }
};

const listServiceBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type && ['stay', 'flight', 'car'].includes(req.query.type)) filter.serviceType = req.query.type;
    const bookings = await ServiceBooking.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ bookings });
  } catch (error) { next(error); }
};

module.exports = { createServiceBooking, listServiceBookings };
