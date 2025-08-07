const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

async function connecToMongoDB(url) {
   return mongoose.connect(url);
}

module.exports = connecToMongoDB;