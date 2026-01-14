const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const api = require('./api');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', api);

// Serve frontend static files from the sibling `frontend` folder so the site is available at the same host.
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

// Serve the homepage at `/`
app.get('/', (_, res) => {
	res.sendFile(path.join(frontendPath, 'home.html'));
});

// SPA fallback: send index.html for non-API routes (app entry)
app.get('*', (req, res, next) => {
	if (req.path.startsWith('/api/')) return next();
	res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
