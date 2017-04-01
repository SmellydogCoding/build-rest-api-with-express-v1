'use strict';

const auth = require('basic-auth');
const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

const authRequired = (req,res,next) => {
  if (auth(req)) {
    // res.send(auth(req));
    let username = auth(req).name;
    let password = auth(req).pass;
    Users.find({emailAddress: username}, (error,user) => {
      if (error) {
        return next(error);
      } else if (user[0] === undefined) {
        res.status = 401;
        res.send('Username not found');
      } else {
        bcrypt.compare(password, user[0].password , (error, result) => {
          if (result === true) {
            res.status = 200;
            res.currentUser = user[0];
            res.send(res.currentUser);
          } else {
            res.status = 401;
            res.send('invalid password');
          }
        })
      }
    });
  } else {
    res.status = 401;
    res.send('authentication required');
  }
}

module.exports.authRequired = authRequired;