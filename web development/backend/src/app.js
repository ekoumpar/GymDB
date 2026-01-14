// Core framework and configuration
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Route and middleware imports
const api = require('./routes/api');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// App setup: parsers, CORS and request logging
const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// API routes
app.use('/api', api);

// Serve frontend static files from the top-level `frontend/public` folder so the site is available at the same host.
const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'public');
app.use(express.static(frontendPath));

// Serve the homepage at `/`
app.get('/', (_, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// SPA fallback: send index.html for non-API routes (app entry)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// error handler (after routes)
app.use(errorHandler);

module.exports = app;
