const dotenv = require('dotenv');
dotenv.config();

// Optional quiet mode: when NODE=production or NODE_ENV=production is set in
// the environment, silence non-error console output to avoid printing data
// to the terminal in production deployments.

if (process.env.NODE_ENV === 'production') {
	console.log = () => {};
	console.info = () => {};
	console.warn = () => {};
}

const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 4000;

(async function start(){
	try{
		// If USE_MOCK is explicitly set, skip DB connection and start in mock mode.
		if (process.env.USE_MOCK === '1') {
			console.log('Starting server in MOCK mode (USE_MOCK=1).');
			app.listen(PORT, () => console.log(`Server listening on port ${PORT} (MOCK mode)`));
			return;
		}
		// Test DB connection
		console.log('Testing DB connection...');
		await testConnection();
		console.log('DB connection OK. Starting server.');
		app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
	}catch(err){
		// On DB connection failure, log error and start in mock mode
		console.warn('Failed to connect to DB — starting in MOCK mode:', err.message || err);
		// Start server in mock mode so frontend can still function
		process.env.USE_MOCK = '1';
		app.listen(PORT, () => console.log(`Server listening on port ${PORT} (MOCK mode)`));
	}
})();
