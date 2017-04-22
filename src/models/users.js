const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// check for properly formatted email
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// check for properly formatted password
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;

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
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "A password is required"],
      match: [passwordRegex, "That is not a valid password.  Password must be at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."]
    },
    confirmPassword: {
      type: String,
      required: [true, "Passwords do not match"],
      validate: [passwordsMatch, "Passwords do not match"]
    }
});

// make sure that password and confirm password match
// personally, I would prefer to do this at the application (route) level and not store confirmPassword in the database at all
function passwordsMatch() {
  return this.password === this.confirmPassword;
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

const User = mongoose.model('User', UserSchema);
module.exports = User;