const db = require('../db');

const addJournalEntry = async (req, res) => {
  try {
    const { object_name, note } = req.body;
    const userId = req.user.id;

    if (!object_name || !note) {
      return res.status(400).json({ message: 'object_name and note are required' });
    }

    await db.query(
      'INSERT INTO journal_entries (user_id, object_name, note) VALUES (?, ?, ?)',
      [userId, object_name, note]
    );

    res.status(201).json({ message: 'Journal entry saved' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getJournalEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const [entries] = await db.query(
      'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ count: entries.length, entries });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addJournalEntry, getJournalEntries };