'use strict';

const express = require('express');
const courses = express.Router();
const Users = require('./models/users.js');
const Reviews = require('./models/reviews.js');
const Courses = require('./models/courses.js');
const mid = require('./middleware/mid.js');

courses.get('/', (req, res, next) => {
  Courses.find({}, (error,courses) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({data: courses});
    }
  });
});
 
courses.post('/', mid.authRequired, (req, res, next) => {
  // use req.body._id to query the fullName of the user that submitted the request
  // match req.body.fullName to res.currentUser.data[0].fullName
  // if they match, post the new course
  // if they don't throw new error
  Users.findOne({_id: req.body.user._id}).exec((error,user) => {
    if (user.fullName === res.currentUser.data[0].fullName) {
      let course = new Courses(req.body);
      course.save((error,course) => {
        if (error) {
          return next(error);
        } else {
          res.status(201).location('/').end();
        }
      });
    } else {
      let error = new Error('Only the current logged in user can create a course.');
      error.status = 400;
      return next(error);
    }
  });
});

courses.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Courses.findById(id).populate('user', 'fullName').populate('reviews').exec((error, courses) => {
    
    let options = {
      path: 'reviews.user',
      model: 'User'
    };

    if (error) {
      return next(error);
    } else {
      // populate courses with documents from the user and reviews collection
      Courses.populate(courses, options, (error, courses) => {
        courses = {data: [courses]};
        res.status(200).json(courses);
      });
    }
  });
});

courses.put('/:id', mid.authRequired, (req, res, next) => {
  
  let id = req.params.id;
  Courses.findById(id).populate('user', 'fullName').populate('reviews').exec((error, course) => {
    
    let options = {
      path: 'reviews.user',
      model: 'User'
    };

    if (error) {
      return next(error);
    } else {
      // match req.body.user._id to course.user.id
      // if they match, put the updated course
      // if they don't throw new error
      if (req.body.user._id === course.user.id) {
        Courses.populate(course, options, (error, course) => {
          course.update(req.body,(error,result) => {
            if (error) {
              return next(error);
            } else {
              res.status(204).end();
            }
          });
        });
      } else {
        let error = new Error('Only the course author can edit a course.');
        error.status = 400;
        return next(error);
      }
    }
  });
});

courses.post('/:courseid/reviews', mid.authRequired, (req, res, next) => {
  // add current user and date to the response body for posting the review
  let id = req.params.courseid;
  req.body.user = res.currentUser.data[0]._id;
  let currentUser = req.body.user;
  req.body.postedOn = new Date().toISOString();

  Courses.findOne({_id: id}).populate('user','fullName').populate('reviews').exec((error,course) => {

    // check to see if the current user has already posted a review for this course
    for (let r = 0; r < course.reviews.length; r++) {
      if (course.reviews[r].user.toJSON() === req.body.user) {
        // format the error so that it will trip the validation handler in the app
        let error = new Error('Review validation failed');
        error.name = "ValidationError";
        error.errors = [{"message": "You can only post 1 review per course", "path": "username"}];
        error.status = 400;
        return next(error);
      }
    };

    // check to see if the current user is also the create of the course that they are trying to post a review on
    if (course.user.fullName === res.currentUser.data[0].fullName) {
      let error = new Error('You cannot create a review on a course that you own.');
      error.status = 400;
      return next(error);
    } else {
      let review = new Reviews(req.body);
      review.save((error,review) => {
        if (error) {
          return next(error);
        } else {
          Courses.update({_id: id}, {$push: {reviews: review}}, (error,success) => {
            if (error) {
              return next(error);
            } else {
              res.status(201).location('/' + id).end();
            }
          });
        }
      });
    }
  });
});

courses.delete('/:courseid/reviews/:id', mid.authRequired, (req, res, next) => {
  let cID = req.params.courseid;
  let rID = req.params.id;
  Reviews.findOne({_id: rID}).populate('user','fullName').exec((error,review) => {
    if (error) {
      return next(error);
      // check to see if the current user is not the author of the review
    } else if (review.user.fullName !== res.currentUser.data[0].fullName) {
      Courses.findOne({_id: cID}).populate('user','fullName').exec((error, course) => {
        if (error) {
          return next(error);
          // if the current user is not the author of the review, check to see if the current user is the author of the course
        } else if (course.user.fullName === res.currentUser.data[0].fullName) {
          deleteReview(rID,cID,res,next);
        } else {
          let error = new Error('Reviews can only be deleted by the review author or the course owner.');
          error.status = 400;
          return next(error);
        }
      });
    } else {
      deleteReview(rID,cID,res,next);
    }
  });
});

// delete a review (I made it a seperate function because the courses.delete route was getting a little crowded)
const deleteReview = (rID,cID,res,next) => {
  Reviews.findByIdAndRemove(rID, (error,success) => {
    if (error) {
      return next(error);
    } else {
      Courses.update({_id: cID},{$pull: {reviews: rID}}, (error,success) => {
        if (error) {
          return next(error);
        } else {
          res.status(204).end();
        }
      });
    }
  });
}

// disallowed http verbs

courses.put('/', (req, res, next) => {
  res.status(403).json('Cannot edit a collection of courses.');
});

courses.delete('/', (req, res, next) => {
  res.status(403).json('Cannot delete a collection of courses.');
});

courses.post('/:id', (req, res, next) => {
  res.status(405).set({'Accept': ['GET', 'PUT']}).json('Use the /api/courses/ route to create a course');
});

courses.delete('/:id', (req, res, next) => {
  res.status(403).set({'Accept': ['GET', 'PUT']}).json('Cannot delete a course.');
});

courses.put('/:courseid/:reviews', (req, res, next) => {
  res.status(403).json('Cannot edit a collection of reviews.');
});

courses.delete('/:courseid/reviews', (req, res, next) => {
  res.status(403).json('Cannot delete a collection of reviews.');
});

courses.get('/:courseid/:reviews/:id', (req, res, next) => {
  res.status(403).set({'Accept': 'DELETE'}).json('Cannot get a single review.  Use the /api/courses/:id route to get reviews for a specific course.');
});

courses.post('/:courseid/reviews/:id', (req, res, next) => {
  res.status(405).set({'Accept': 'DELETE'}).json('Use the /api/courses/:courseid/reviews route to create a review.');
});

courses.put('/:courseid/reviews/:id', (req, res, next) => {
  res.status(403).set({'Accept': 'DELETE'}).json('Cannot edit a review.');
});

module.exports = courses;