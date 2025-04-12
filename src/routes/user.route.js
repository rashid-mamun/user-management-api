const express = require('express');
const router = express.Router();
const apiRoutes = require('../controllers/user.controller');
const checkLogin = require('../middleware/checkLogin');
const upload = require('../validators/image.validator');

router.get('/:id', checkLogin, apiRoutes.getOneUser);
router.put('/:id', checkLogin, apiRoutes.updateOneUser);
router.delete('/:id', checkLogin, apiRoutes.deleteOneUser);
router.post(
  '/image/:id',
  checkLogin,
  upload.single('avatar'),
  apiRoutes.updateOneUserPicture
);

module.exports = router;