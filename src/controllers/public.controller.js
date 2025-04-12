const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const registerSchemaValidator = require('../validators/register.validator');

exports.register = async (req, res) => {
  try {
    await registerSchemaValidator.validateAsync(req.body);

    const {
      firstName,
      lastName,
      email,
      password,
      nid,
      age,
      currentMaritalStatus,
    } = req.body;
    const profilePhoto = req.file ? req.file.filename : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into profiles
      const [profileResult] = await connection.query(
        'INSERT INTO profiles (firstName, lastName, nid, profilePhoto, age, currentMaritalStatus) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, nid, profilePhoto, age, currentMaritalStatus]
      );
      const profileId = profileResult.insertId;

      // Generate JWT
      const authToken = jwt.sign(
        { email, userId: profileId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Insert into auths
      await connection.query(
        'INSERT INTO auths (email, password, auth_token, profileId) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, authToken, profileId]
      );

      await connection.commit();

      res.status(200).json({
        isSuccess: true,
        message: 'Record created successfully',
        data: { profileId, authToken },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Unable to create a record',
      data: null,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [rows] = await pool.query('SELECT * FROM auths WHERE email = ?', [
      email,
    ]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        isSuccess: false,
        message: 'Authentication failed',
        data: null,
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        isSuccess: false,
        message: 'Authentication failed',
        data: null,
      });
    }

    // Generate new JWT
    const authToken = jwt.sign(
      { email: user.email, userId: user.profileId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Update auth_token
    await pool.query('UPDATE auths SET auth_token = ? WHERE email = ?', [
      authToken,
      email,
    ]);

    res.status(200).json({
      isSuccess: true,
      message: 'Login successful',
      data: { accessToken: authToken },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      isSuccess: false,
      message: 'Authentication failed',
      data: null,
    });
  }
};