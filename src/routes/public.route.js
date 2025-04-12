const express = require('express');
const router = express.Router();
const apiRoutes = require('../controller/public.controller');
router.get('/', (req, res) => {
  res.status(200).json('Hello');
});

router.post('/register', apiRoutes.register);
router.post('/login', apiRoutes.login);
module.exports = router;
