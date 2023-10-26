const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg');
  },
});

const multerFilter = (req, file, cb) => {
  if (file?.mimetype?.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ msg: 'Unsupported file format' }, false);
  }
};

const uploadImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 1024 * 1024 },
});

const imageResize = async (req, res, next) => {
  if (!req.files) {
    return next();
  } else {
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${file.filename}`);
        fs.unlinkSync(`public/images/products/${file.filename}`);
      })
    );
  }
  next();
};

module.exports = { uploadImage, imageResize };
