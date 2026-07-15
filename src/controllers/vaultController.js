const db = require('../db');

const saveToVault = async (req, res) => {
  try {
    const { object_name, object_type, nasa_image_url, description } = req.body;
    const userId = req.user.id;

    if (!object_name || !object_type) {
      return res.status(400).json({ message: 'object_name and object_type are required' });
    }

    await db.query(
      'INSERT INTO saved_objects (user_id, object_name, object_type, nasa_image_url, description) VALUES (?, ?, ?, ?, ?)',
      [userId, object_name, object_type, nasa_image_url || null, description || null]
    );

    res.status(201).json({ message: 'Object saved to your vault' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { personal_note } = req.body;
    const userId = req.user.id;

    // Confirm this saved object actually belongs to the logged-in user before editing it
    const [existing] = await db.query(
      'SELECT id FROM saved_objects WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Saved object not found' });
    }

    await db.query(
      'UPDATE saved_objects SET personal_note = ? WHERE id = ?',
      [personal_note, id]
    );

    res.json({ message: 'Note updated' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getVault = async (req, res) => {
  try {
    const userId = req.user.id;

    const [objects] = await db.query(
      'SELECT * FROM saved_objects WHERE user_id = ? ORDER BY saved_at DESC',
      [userId]
    );

    res.json({ count: objects.length, objects });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { saveToVault, getVault , updateNote};