// Run this ONCE to create your admin user in MongoDB
// Command: node createUser.js
// Then DELETE this file — don't leave it in production

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');



async function createUser() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mongo-training');

  const existing = await User.findOne({ email: EMAIL });
  if (existing) {
    console.log('User already exists:', EMAIL);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(PASSWORD, 10);
  await User.create({ email: EMAIL, password: hashed });
  console.log('User created successfully:', EMAIL);
  process.exit(0);
}

createUser().catch((err) => {
  console.error(err);
  process.exit(1);
});
