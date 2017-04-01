const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      match: [emailRegex, "Please enter a valid email address"],
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    confirmPassword: {
      type: String,
      required: true
    }
});

// hash password before saving to database
UserSchema.pre('save', function(next)  {
  let user = this;
  bcrypt.hash(user.password, 10, function(error, hash) {
    if (error) {
      return next(error);
    } else {
      user.password = hash;
      user.confirmPassword = hash;
      next();
    }
  });
});

UserSchema.pre('update', function(next)  {
  let user = this;
  bcrypt.hash(user._update.$set.password, 10, function(error, hash) {
    if (error) {
      return next(error);
    } else {
      user._update.$set.password = hash;
      user._update.$set.confirmPassword = hash;
      next();
    }
  });
});

UserSchema.pre('validate', function(next) {
  let user = this;
  if (user.password !== user.confirmPassword) {
    return next('Passwords must match');
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;