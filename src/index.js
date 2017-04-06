'use strict';

// load modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validation = require('./validation.js')
// const session = require('express-session');
// const mongoStore = require('connect-mongo')(session);

// mongodb connection
mongoose.connect("mongodb://localhost:27017/course-rating");
const db = mongoose.connection;
db.on('open', () => {console.log('Database connection successful')});
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// const seeder = require('mongoose-seeder');
// const data = require('./data/data.json');

// seeder.seed(data).then(function(dbData) {
//     // The database objects are stored in dbData
// }).catch(function(err) {
//     // handle error
// });

// use sessions for tracking logins
// app.use(session({
//   secret: 'treehouse loves you',
//   resave: true,
//   saveUninitialized: false,
//   store: new mongoStore({mongooseConnection: db})
// }));

// make user ID available in templates
// app.use(function (req, res, next) {
//   res.locals.currentUser = req.session.userId;
//   next();
// });

// enable method=DELETE and method=PUT in HTML forms
// app.use(methodOverride('_method'));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// API Routes
const users = require('./users.js');
const courses = require('./courses');
app.use('/api/users', users);
app.use('/api/courses', courses);

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let error = new Error('File Not Found');
  error.status = 404;
  next(error);
});

// error handler
// define as the last app.use callback
app.use((error, req, res, next) => {
  if (error.message === 'Course validation failed' || error.message === 'Review validation failed' || error.message === 'User validation failed') {
    let validationErrors = validation.formatErrors(error);
    res.status(400).json(validationErrors);
  } else {
    error = { 'message': error.message, 'status': error.status };
    res.status(error.status || 500).json(error);
  }
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);  
});