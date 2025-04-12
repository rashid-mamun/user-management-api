const mysql = require('mysql2/promise');
const config = require('./index');

const pool = mysql.createPool({
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  user: config.DATABASE_USERNAME,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE,
  connectionLimit: 300,
  waitForConnections: true,
  queueLimit: 0,
});

module.exports = pool;