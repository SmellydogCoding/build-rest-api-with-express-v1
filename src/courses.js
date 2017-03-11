'use strict';

const express = require('express');
const courses = express.Router();

courses.get('/', (req, res, next) => {
  let courses = {
    data: [
      {
        "_id": "32l3kl42j3l2k4j342lk4j3l2k",
        "title": "Mock Course Title"
      }
  ]
};
  res.status = 200;
  res.send(courses);
});

courses.post('/', (req, res, next) => {
  
});

courses.get('/:id', (req, res, next) => {
  
});

courses.put('/:id', (req, res, next) => {
  
});

courses.post('/:courseid/reviews', (req, res, next) => {
  
});

courses.delete('/:courseid/reviews/:id', (req, res, next) => {
  
});

module.exports = courses;