const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://astrovault-production.up.railway.app'
}));
app.use(express.json());
app.use(express.static('public'));
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const apodRoutes = require('./routes/apodRoutes');
app.use('/api', apodRoutes);
const searchRoutes = require('./routes/searchRoutes');
app.use('/api', searchRoutes);
const skyRoutes = require('./routes/skyRoutes');
app.use('/api', skyRoutes);
const vaultRoutes = require('./routes/vaultRoutes');
app.use('/api', vaultRoutes);
const journalRoutes = require('./routes/journalRoutes');
app.use('/api', journalRoutes);

app.get('/', (req, res) => {
  res.send('AstroVault backend is running!');
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connected!', result: rows[0].result });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
