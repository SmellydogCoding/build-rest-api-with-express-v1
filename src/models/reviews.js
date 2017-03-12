const mongoose = require('mongoose');
const Users = require('./users.js');
const ReviewSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    postedOn: Date,
    rating: Number,
    review: String
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;