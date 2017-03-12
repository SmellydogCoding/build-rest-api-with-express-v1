const mongoose = require('mongoose');
const User = require('./users.js');
const Reviews = require('./reviews.js')
const CourseSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
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
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

// CourseSchema.virtual('overallRating').get(() => {
//   let total;
//   this.reviews.forEach((review) => {
//     total += review.rating;
//   });
//   return total / reviews.length;
//   console.log(reviews);
// });

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;