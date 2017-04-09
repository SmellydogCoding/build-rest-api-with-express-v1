const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: [true, "Please enter your Full Name"],
      trim: true,
    },
    emailAddress: {
      type: String,
      required: [true, "Please enter an email address"],
      match: [emailRegex, "Please enter a valid email address"],
      // validate: [uniqueEmail, "That email is already in use"],
      trim: true
    },
    password: {
      type: String,
      required: [true, "A password is required"]
    },
    confirmPassword: {
      type: String,
      required: [true, "Please re-enter your password"],
      validate: [passwordsMatch, "Passwords do not match"]
    }
});

function passwordsMatch() {
  return this.password === this.confirmPassword;
}

function validEmail() {
  return emailRegex.test(this.emailAddress);
}

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

UserSchema.path('emailAddress').validate((value,done) => {
  User.count({emailAddress: value}, function(error,result) {
    if (error) {
      return done(error);
    }
    done(!result)
  });
},"That email address is already in use");

const User = mongoose.model('User', UserSchema);
module.exports = User;