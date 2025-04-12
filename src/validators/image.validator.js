const multer = require('multer');
const path = require('path');
const config = require('../config');

const UPLOADS_FOLDER = config.IMAGE_FOLDER;

const imagePath = path.join(process.cwd(), UPLOADS_FOLDER);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();

    cb(null, fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .png, or .jpeg format allowed!'));
      }
    } else {
      cb(new Error('Unexpected field'));
    }
  },
});

module.exports = upload;