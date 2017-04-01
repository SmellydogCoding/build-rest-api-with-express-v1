'use strict';

const express = require('express');
const courses = express.Router();
const Users = require('./models/users.js');
const Reviews = require('./models/reviews.js');
const Courses = require('./models/courses.js');

courses.get('/', (req, res, next) => {
  Courses.find({}, (error,courses) => {
    if (error) {
      return next(error);
    } else {
        res.status = 200;
        courses = {data: courses}
        res.json(courses);
    }
  });
});
 
courses.post('/', (req, res, next) => {
  let course = new Courses(req.body);
  course.save((error,course) => {
    if (error.message === 'Course validation failed') {
      let validationErrors = formatErrors(error);
      res.status = 400;
      res.json(validationErrors);
    } else if (error) {
      return next(error);
    } else {
      res.status = 201;
      res.location('/');
      res.end();
    }
  });
});

courses.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Courses.findById(id).populate('user', 'fullName').populate('reviews').exec((error, courses) => {
    
    let options = {
      path: 'reviews.user',
      model: 'User'
    };

    if (error) {
      return next(error);
    } else {
      res.status = 200;
      Courses.populate(courses, options, (error, courses) => {
        courses = {data: [courses]};
        res.json(courses);
      });
    }
  });
});

courses.put('/:id', (req, res, next) => {
  let id = req.params.id;
  Courses.findById(id).populate('user', 'fullName').populate('reviews').exec((error, course) => {
    
    let options = {
      path: 'reviews.user',
      model: 'User'
    };

    if (error.message === 'Course validation failed') {
      let validationErrors = formatErrors(error);
      res.status = 400;
      res.json(validationErrors);
    } else if (error) {
      return next(error);
    } else {
      res.status = 200;
      Courses.populate(course, options, (error, course) => {
        course.update(req.body,(error,result) => {
          if (error) {
            return next(error);
          } else {
            res.status = 204;
            res.end();
          }
        });
      });
    }
  });
});

courses.post('/:courseid/reviews', (req, res, next) => {
  let id = req.params.courseid;
  let review = new Reviews(req.body);
  review.save((error,review) => {
if (error.message === 'Course validation failed') {
      let validationErrors = formatErrors(error);
      res.status = 400;
      res.json(validationErrors);
    } else if (error) {
      return next(error);
    } else {
      Courses.update({_id: id}, {$push: {reviews: review}}, (error,success) => {
        if (error) {
          return next(error);
        } else {
          res.status = 201;
          res.location('/' + id);
          res.end();
        }
      });
    }
  });
});

courses.delete('/:courseid/reviews/:id', (req, res, next) => {
  let cID = req.params.courseid;
  let rID = req.params.id;
  Reviews.findByIdAndRemove(rID, (error,success) => {
    if (error) {
      return next(error);
    } else {
      Courses.update({_id: cID},{$pull: {reviews: rID}}, (error,success) => {
        if (error) {
          return next(error);
        } else {
          res.status = 204;
          res.end();
        }
      });
    }
  });
});

const formatErrors = (error) => {
  let validationErrors = {
    "message": "Validation Failed",
    'errors': {
      'property': [

      ]
    }
  };
  for (let item in error.errors) {
    if (error.errors.hasOwnProperty(item)) {
      let code = error.errors[item].path;
      let message = error.errors[item].message;
      validationErrors.errors.property.push({'code': code, 'message': message});
    }
  };
  return validationErrors;
}

module.exports = courses;