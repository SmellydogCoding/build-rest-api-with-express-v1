'use strict';

// format a validation error from mongoose so that it can be used by the validation handler in the app
const formatErrors = (error) => {
  let validationErrors = {
    "message": "Validation Failed",
    'errors': {}
  };
  for (let item in error.errors) {
    if (error.errors.hasOwnProperty(item)) {
      let property = error.errors[item].path;
      let message = error.errors[item].message;
      validationErrors.errors[property] = ([{'code': 400, 'message': message}]);
    }
  };
  return validationErrors;
}

module.exports.formatErrors = formatErrors;