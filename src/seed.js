const mongoose = require('mongoose');
const seeder = require('mongoose-seeder');
const data = require('./data/data.json');
const Users = require('./models/users.js');
const Reviews = require('./models/reviews.js');
const Courses = require('./models/courses.js');

// seed database using provided data
mongoose.connect("mongodb://localhost:27017/course-rating", () => {
  seeder.seed(data).then(function(dbData) {
    // The database objects are stored in dbData
  }).catch(function(err) {
      console.log(err);
  });
});