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
  
});

module.exports = users;