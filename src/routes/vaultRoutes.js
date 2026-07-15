const express = require('express');
const router = express.Router();
const { saveToVault, getVault, updateNote } = require('../controllers/vaultController');
const authMiddleware = require('../middleware/auth');

router.post('/vault', authMiddleware, saveToVault);
router.get('/vault', authMiddleware, getVault);
router.patch('/vault/:id', authMiddleware, updateNote);

module.exports = router;