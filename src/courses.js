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
      const error = new Error('Only the current logged in user can create a course.');
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
      res.status = 200;
      Courses.populate(courses, options, (error, courses) => {
        courses = {data: [courses]};
        res.json(courses);
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
        const error = new Error('Only the course author can edit a course.');
        error.status = 400;
        return next(error);
      }
    }
  });
});

courses.post('/:courseid/reviews', mid.authRequired, (req, res, next) => {
  let id = req.params.courseid;
  req.body.user = res.currentUser.data[0]._id;
  req.body.postedOn = new Date().toISOString();
  Courses.findOne({_id: id}).populate('user','fullName').exec((error,course) => {
    if (course.user.fullName === res.currentUser.data[0].fullName) {
      const error = new Error('You cannot create a review on a course that you own.');
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
    } else if (review.user.fullName !== res.currentUser.data[0].fullName) {
      Courses.findOne({_id: cID}).populate('user','fullName').exec((error, course) => {
        if (error) {
          return next(error);
        } else if (course.user.fullName === res.currentUser.data[0].fullName) {
          deleteReview(rID,cID,res,next);
        } else {
          const error = new Error('Reviews can only be deleted by the review author or the course owner.');
          error.status = 400;
          return next(error);
        }
      });
    } else {
      deleteReview(rID,cID,res,next);
    }
  });
});

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