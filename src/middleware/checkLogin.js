const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const checkLogin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        isSuccess: false,
        message: 'Authorization header missing',
        data: null,
      });
    }

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify token exists in auths table
    const [rows] = await pool.query(
      'SELECT * FROM auths WHERE auth_token = ? AND profileId = ?',
      [token, decoded.userId]
    );
    if (!rows[0]) {
      return res.status(401).json({
        isSuccess: false,
        message: 'Invalid or expired token',
        data: null,
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      isSuccess: false,
      message: 'Authentication failure',
      data: null,
    });
  }
};

module.exports = checkLogin;