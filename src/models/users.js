const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// require('./courses.js');

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

// hash password before saving to database
UserSchema.pre('save', (next) => {
  let user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;