const db = require('../db');

const saveToVault = async (req, res) => {
  try {
    const { object_name, object_type, nasa_image_url } = req.body;
    const userId = req.user.id; // comes from the JWT middleware

    if (!object_name || !object_type) {
      return res.status(400).json({ message: 'object_name and object_type are required' });
    }

    await db.query(
      'INSERT INTO saved_objects (user_id, object_name, object_type, nasa_image_url) VALUES (?, ?, ?, ?)',
      [userId, object_name, object_type, nasa_image_url || null]
    );

    res.status(201).json({ message: 'Object saved to your vault' });

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

module.exports = { saveToVault, getVault };