'use strict';

const express = require('express');
const users = express.Router();
const Users = require('./models/users.js');

users.get('/', (req, res, next) => {
  Users.find().exec((error, user) => {
    if (error) {
      return next(error);
    } else {
      res.status = 200;
      res.send(user);
    }
  });
});

users.post('/', (req, res, next) => {
  let user = new Users(req.body);
  user.save((error,user) => {
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

module.exports = users;