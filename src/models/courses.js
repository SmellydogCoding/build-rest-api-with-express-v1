const mongoose = require('mongoose');
const Users = require('./users.js');
const Reviews = require('./reviews.js')
const CourseSchema = new mongoose.Schema({
    user: Users._id,
    title: String,
    description: String,
    estimatedTime: String,
    materialsNeeded: String,
    steps: [
      {
        stepNumber: Number,
        title: String,
        description: String
      }
    ],
    reviews: [Reviews._id]
});

CourseSchema.virtual('overallRating').get(() => {
  let total;
  this.reviews.forEach((review) => {
    total += review.rating;
  });
  return total / reviews.length;
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;