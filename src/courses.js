'use strict';

const express = require('express');
const courses = express.Router();
const Users = require('./models/users.js');
const Reviews = require('./models/reviews.js');
const Courses = require('./models/courses.js');

courses.get('/', (req, res, next) => {
  Courses.find().populate('user', 'fullName').populate('reviews').exec((error, courses) => {
    
    let options = {
      path: 'reviews.user',
      model: 'User'
    };

    if (error) {
      return next(error);
    } else {
      res.status = 200;
      Courses.populate(courses, options, (error, courses) => {
        courses = {data: courses}
        res.json(courses);
      });
    }
  });
});
 
courses.post('/', (req, res, next) => {
  
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
  
});

courses.post('/:courseid/reviews', (req, res, next) => {
  
});

courses.delete('/:courseid/reviews/:id', (req, res, next) => {
  
});

module.exports = courses;