const mongoose = require('mongoose');
require('./courses.js');
const UserSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;