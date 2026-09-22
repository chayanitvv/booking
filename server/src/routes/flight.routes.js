const express = require('express');
const { listFlights } = require('../controllers/flight.controller');

const router = express.Router();
router.get('/', listFlights);
module.exports = router;
