const db = require('../db');

const getAPOD = async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Step A: check if we already saved today's APOD in our database
    const [rows] = await db.query(
      'SELECT * FROM daily_apod WHERE date = ?',
      [today]
    );

    if (rows.length > 0) {
      // Already have it — no need to call NASA again
      return res.json(rows[0]);
    }

    // Step B: not in database yet — fetch it from NASA
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
    );
    const data = await response.json();

    // Step C: save it to our database for next time
    await db.query(
      'INSERT INTO daily_apod (date, title, image_url, explanation) VALUES (?, ?, ?, ?)',
      [today, data.title, data.url, data.explanation]
    );

    // Step D: send it back to whoever asked
    res.json({
      date: today,
      title: data.title,
      image_url: data.url,
      explanation: data.explanation
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAPOD };