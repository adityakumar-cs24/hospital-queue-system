require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Patient = require('./models/Patient');

connectDB().then(async () => {
  const p = await Patient.create({
    name: 'Test Patient',
    email: 'test@example.com',
    phone: '9999999999',
    password: 'temp123',
  });
  console.log('Created:', p);
  mongoose.connection.close();
});