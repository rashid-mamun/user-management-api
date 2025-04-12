require('dotenv').config();

class Config {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.PORT = process.env.PORT || 3000;
    this.API_BASE = '/api';
    this.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
    this.DATABASE_PORT = process.env.DATABASE_PORT || 3306;
    this.DATABASE = process.env.DATABASE || 'your_db';
    this.DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'root';
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.IMAGE_FOLDER = process.env.IMAGE_FOLDER || 'uploads';
  }
}

module.exports = new Config();