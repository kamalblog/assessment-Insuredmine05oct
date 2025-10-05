
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('MongoDB Connected');
  return mongoose.connection;
};

module.exports = connectDB;
