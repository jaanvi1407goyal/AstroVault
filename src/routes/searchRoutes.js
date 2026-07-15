const express = require('express');
const router = express.Router();
const { searchImages } = require('../controllers/searchController');

router.get('/search', searchImages);

module.exports = router;