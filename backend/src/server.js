// Main server entry point for the URL Shortener API

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const { redirectToOriginal } = require('./controllers/urlController');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

// --- Health check ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// --- Public redirect route ---
// Must be registered after API routes to avoid conflicts with /api/* paths
app.get('/:shortCode', redirectToOriginal);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
