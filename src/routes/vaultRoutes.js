const express = require('express');
const router = express.Router();
const { saveToVault, getVault } = require('../controllers/vaultController');
const authMiddleware = require('../middleware/auth');

router.post('/vault', authMiddleware, saveToVault);
router.get('/vault', authMiddleware, getVault);

module.exports = router;