const pool = require('../config/database');

exports.getOneUser = async (req, res) => {
  try {
    if (req.userId !== parseInt(req.params.id)) {
      return res.status(403).json({
        isSuccess: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const [rows] = await pool.query(
      `SELECT p.*, a.email
       FROM profiles p
       JOIN auths a ON p.id = a.profileId
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({
        isSuccess: false,
        message: 'User not found',
        data: null,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: 'Profile retrieved successfully',
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Internal Server Error',
      data: null,
    });
  }
};

exports.updateOneUser = async (req, res) => {
  try {
    if (req.userId !== parseInt(req.params.id)) {
      return res.status(403).json({
        isSuccess: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const { firstName, lastName, nid, age, currentMaritalStatus } = req.body;
    const profilePhoto = req.file ? req.file.filename : req.body.profilePhoto;

    const [result] = await pool.query(
      `UPDATE profiles
       SET firstName = ?, lastName = ?, nid = ?, profilePhoto = ?, age = ?, currentMaritalStatus = ?
       WHERE id = ?`,
      [
        firstName,
        lastName,
        nid,
        profilePhoto,
        age,
        currentMaritalStatus,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: 'User not found',
        data: null,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: 'User updated successfully',
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Internal Server Error',
      data: null,
    });
  }
};

exports.deleteOneUser = async (req, res) => {
  try {
    if (req.userId !== parseInt(req.params.id)) {
      return res.status(403).json({
        isSuccess: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const [result] = await pool.query('DELETE FROM profiles WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: 'User not found',
        data: null,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: 'User deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Internal Server Error',
      data: null,
    });
  }
};

exports.updateOneUserPicture = async (req, res) => {
  try {
    if (req.userId !== parseInt(req.params.id)) {
      return res.status(403).json({
        isSuccess: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const profilePhoto = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      'UPDATE profiles SET profilePhoto = ? WHERE id = ?',
      [profilePhoto, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: 'User not found',
        data: null,
      });
    }

    res.status(200).json({
      isSuccess: true,
      message: 'Profile picture updated successfully',
      data: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Internal Server Error',
      data: null,
    });
  }
};