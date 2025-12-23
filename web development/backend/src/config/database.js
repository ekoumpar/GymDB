const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gymdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection(){
  try{
    const [rows] = await pool.query('SELECT 1 as ok');
    return true;
  }catch(err){
    // rethrow to let caller handle
    throw err;
  }
}

module.exports = pool;
module.exports.testConnection = testConnection;
