const mongoose = require('mongoose');
const Users = require('./users.js');
const ReviewSchema = new mongoose.Schema({
    user: Users._id,
    postedOn: Date,
    rating: Number,
    review: String
});

const Review = mongoose.model('Review', UserSchema);
module.exports = Review;