const asyncHandler = require('express-async-handler');

const transporter = require('../configs/transporter');

const sendEmail = asyncHandler(async (data) => {
  await transporter.sendMail({
    from: 'Shop Shoes <pmmdrg2605@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
});

module.exports = sendEmail;
