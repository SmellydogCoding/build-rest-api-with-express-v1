const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
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

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;