const express = require('express');
const router = express.Router();
const publicRoute = require('./public.route');
const userRoute = require('./user.route');
router.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center">App Online, 2025!</h1>');
  });
router.use('', publicRoute);
router.use('/users', userRoute);

module.exports = router;
