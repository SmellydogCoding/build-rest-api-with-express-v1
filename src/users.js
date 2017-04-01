'use strict';

const express = require('express');
const users = express.Router();
const Users = require('./models/users.js');
const mid = require('./middleware/mid.js');

users.get('/', mid.authRequired, (req, res, next) => {
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

users.put('/', (req, res, next) => {
  Users.update({emailAddress: req.body.emailAddress}, req.body, (error,user) => {
    // if (error.message === 'Course validation failed') {
    //   let validationErrors = formatErrors(error);
    //   res.status = 400;
    //   res.json(validationErrors);
    // } else if (error) {
      if (error) {
      return next(error);
    } else {
      res.status = 204;
      res.end();
    }
  });
});

module.exports = users;