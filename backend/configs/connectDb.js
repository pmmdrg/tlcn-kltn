const mongoose = require('mongoose');

const connect = (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('Connect successfully!');
    })
    .catch(() => {
      console.log('Connect failed');
    });
};

module.exports = connect;
