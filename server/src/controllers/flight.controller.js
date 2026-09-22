const Flight = require('../models/flight.model');

const demoFlights = [
  { flightNumber: 'SJ101', airline: 'Sunset Air', departure: { airportCode: 'BKK', airportName: 'Suvarnabhumi Airport', city: 'Bangkok', time: new Date('2026-10-18T08:30:00+07:00') }, arrival: { airportCode: 'CNX', airportName: 'Chiang Mai Airport', city: 'Chiang Mai', time: new Date('2026-10-18T09:45:00+07:00') }, durationMinutes: 75, seats: [{ seatNumber: '12A', seatClass: 'Economy', price: 1890 }, { seatNumber: '12B', seatClass: 'Economy', price: 1890 }, { seatNumber: '14A', seatClass: 'Economy', price: 1890 }] },
  { flightNumber: 'SJ205', airline: 'Sunset Air', departure: { airportCode: 'BKK', airportName: 'Suvarnabhumi Airport', city: 'Bangkok', time: new Date('2026-10-18T13:15:00+07:00') }, arrival: { airportCode: 'CNX', airportName: 'Chiang Mai Airport', city: 'Chiang Mai', time: new Date('2026-10-18T14:30:00+07:00') }, durationMinutes: 75, seats: [{ seatNumber: '10A', seatClass: 'Economy', price: 2290 }, { seatNumber: '10B', seatClass: 'Economy', price: 2290 }, { seatNumber: '11A', seatClass: 'Economy', price: 2290 }] },
  { flightNumber: 'SJ330', airline: 'Sunset Air', departure: { airportCode: 'CNX', airportName: 'Chiang Mai Airport', city: 'Bangkok', time: new Date('2026-10-19T16:10:00+07:00') }, arrival: { airportCode: 'BKK', airportName: 'Suvarnabhumi Airport', city: 'Bangkok', time: new Date('2026-10-19T17:25:00+07:00') }, durationMinutes: 75, seats: [{ seatNumber: '8A', seatClass: 'Economy', price: 1990 }, { seatNumber: '8B', seatClass: 'Economy', price: 1990 }, { seatNumber: '9A', seatClass: 'Economy', price: 1990 }] },
];

const listFlights = async (req, res, next) => {
  try {
    if ((await Flight.countDocuments()) === 0) await Flight.insertMany(demoFlights);

    const filter = {};
    if (req.query.from) filter['departure.city'] = new RegExp(`^${req.query.from}$`, 'i');
    if (req.query.to) filter['arrival.city'] = new RegExp(`^${req.query.to}$`, 'i');
    const flights = await Flight.find(filter).sort({ 'departure.time': 1 });
    res.json({ flights });
  } catch (error) { next(error); }
};

module.exports = { listFlights };
