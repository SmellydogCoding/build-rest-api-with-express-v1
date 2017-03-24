const mongoose = require('mongoose');
const User = require('./users.js');
const Reviews = require('./reviews.js');

const StepsSchema = new mongoose.Schema({
  stepNumber: Number,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const CourseSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    estimatedTime: String,
    materialsNeeded: String,
    steps: [StepsSchema],
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

CourseSchema.path('steps').validate((value) => {
  return value.length;
},"The course must have at least one step");

CourseSchema.virtual('overallRating').get(function() {
  let total = 0;
  this.reviews.forEach((review) => {
    total += review.rating;
  });
  return total / this.reviews.length;
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;