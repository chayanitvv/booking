const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const { createServiceBooking, listServiceBookings } = require('../controllers/service-booking.controller');
const router = express.Router();

router.post('/', requireAuth, createServiceBooking);
router.get('/', listServiceBookings);

module.exports = router;
