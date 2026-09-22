const express = require('express');
const { bookFlight } = require('../controllers/booking.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();
router.post('/flight', requireAuth, bookFlight);
module.exports = router;
