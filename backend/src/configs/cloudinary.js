const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const cloudinaryUploadImg = (path) => {
  return new Promise(async (resolve) => {
    const result = await cloudinary.uploader.upload(path);

    return resolve(
      {
        url: result.secure_url,
        asset_id: result.asset_id,
        public_id: result.public_id,
      },
      { resource_type: 'auto' }
    );
  });
};

const cloudinaryDeleteImg = (path) => {
  return new Promise(async (resolve) => {
    const result = await cloudinary.uploader.destroy(path);

    return resolve(
      {
        url: result.secure_url,
        asset_id: result.asset_id,
        public_id: result.public_id,
      },
      { resource_type: 'auto' }
    );
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
