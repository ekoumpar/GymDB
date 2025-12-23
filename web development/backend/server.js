const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 4000;

(async function start(){
	try{
		console.log('Testing DB connection...');
		await testConnection();
		console.log('DB connection OK. Starting server.');
		app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
	}catch(err){
		console.warn('Failed to connect to DB — starting in MOCK mode:', err.message || err);
		// Start server in mock mode so frontend can still function
		process.env.USE_MOCK = '1';
		app.listen(PORT, () => console.log(`Server listening on port ${PORT} (MOCK mode)`));
	}
})();
