'use strict';

const auth = require('basic-auth');
const Users = require('../models/users.js');
const bcrypt = require('bcrypt');

const authRequired = (req,res,next) => {
  if (auth(req)) {
    let username = auth(req).name;
    let password = auth(req).pass;
    Users.find({emailAddress: username}, (error,user) => {
      if (error) {
        return next(error);
      } else if (user[0] === undefined) {
        const error = new Error("That username does not exist");
        error.status = 401;
        return next(error);
      } else {
        bcrypt.compare(password, user[0].password , (error, result) => {
          if (result === true) {
            res.currentUser = { "data": [ {"fullName": user[0].fullName, "_id": user[0].id} ] };
            return next();
          } else {
            const error = new Error("Incorrect Password");
            error.status = 401;
            return next(error);
          }
        })
      }
    });
  } else {
    res.status = 401;
    res.send('You must login to access this section');
  }
}

module.exports.authRequired = authRequired;