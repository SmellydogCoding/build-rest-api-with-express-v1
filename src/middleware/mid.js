'use strict';

const auth = require('basic-auth');
const Users = require('../models/users.js');

const authRequired = (req,res,next) => {
  if (auth(req)) {
    // res.send(auth(req));
    let username = auth(req).name;
    Users.find({emailAddress: username}, (error,user) => {
      if (error) {
        return next(error);
      } else if (user[0] === undefined) {
        res.status = 401;
        res.send('Username not found');
      } else {
        res.status = 200;
        res.send(user);
      }
    });
  } else {
    res.status = 401;
    res.send('authentication required');
  }
}

module.exports.authRequired = authRequired;