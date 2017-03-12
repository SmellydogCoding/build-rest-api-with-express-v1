const mongoose = require('mongoose');
const seeder = require('mongoose-seeder');
const data = require('./data/data.json');
const Users = require('./models/users.js');
const Reviews = require('./models/reviews.js');
const Courses = require('./models/courses.js');

mongoose.connect("mongodb://localhost:27017/course-rating", () => {
  // seeder.loadModels([
  //   './src/data/user.json',
  //   './src/data/review.json',
  //   './src/data/course.json'
  // ]);
  // // Clear specified collections 
  // seeder.clearModels(['User', 'Review', 'Course'], function(data) {

  //   // Callback to populate DB once collections have been cleared 
  //   seeder.populateModels(data);

  // });
  seeder.seed(data).then(function(dbData) {
    // The database objects are stored in dbData
  }).catch(function(err) {
      console.log(err);
  });
});