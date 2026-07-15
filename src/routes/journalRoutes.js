const express = require('express');
const router = express.Router();
const { addJournalEntry, getJournalEntries } = require('../controllers/journalController');
const authMiddleware = require('../middleware/auth');

router.post('/journal', authMiddleware, addJournalEntry);
router.get('/journal', authMiddleware, getJournalEntries);

module.exports = router;