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

users.put('/', (req, res, next) => {
  res.status(403).json('Cannot edit a collection of users.');
});

users.delete('/', (req, res, next) => {
  res.status(403).json('Cannot delete a collection of users.');
});

module.exports = users;