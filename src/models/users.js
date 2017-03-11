const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    emailAddress: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;