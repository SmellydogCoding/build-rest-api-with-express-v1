'use strict';

// load modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

// mongodb connection
mongoose.connect("mongodb://localhost:27017/course-rating");
const db = mongoose.connection;
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
app.use(methodOverride('_method'));

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

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);  
});