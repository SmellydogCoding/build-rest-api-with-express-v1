'use strict';

const express = require('express');
const users = express.Router();
const Users = require('./models/users.js');
const mid = require('./middleware/mid.js');

users.get('/', mid.authRequired, (req, res, next) => {
  res.status(200).json(res.currentUser);
});

users.post('/', (req, res, next) => {
  let user = new Users(req.body);
  user.save((error,user) => {
    if (error) {
      return next(error);
    } else {
      res.status(201).location('/').end();
    }
  });
});

module.exports = users;