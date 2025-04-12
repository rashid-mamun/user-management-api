const app = require('./src/app');
const config = require('./src/config');
const pool = require('./src/config/database');

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();

    app.listen(config.PORT, () => {
      console.log(`App listening at http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error.message);
    process.exit(1);
  }
}

startServer();