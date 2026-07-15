const express = require('express');
const router = express.Router();
const { getTonightSky } = require('../controllers/skyController');

router.get('/tonight-sky', getTonightSky);

module.exports = router;