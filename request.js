var _req = require('request-promise'),
  Promise = require('bluebird');

let allowed_methods = ['GET', 'POST', 'PUT', 'DELETE'];

module.exports = function () {
  return (method, endpoint, data = {}) => {
    console.log(this);
    return new Promise((resolve, reject) => {
      if (allowed_methods.indexOf(method.toUpperCase()) < 0) {
        return reject({err: 'Invalid Request Method'});
      }
      // build request object
      var options = {
        method: method,
        uri: this.api + endpoint,
        headers : {
          'Authorization' : 'Bearer ' + this.access_token
        },
        body : data,
        json: true
      };
      console.log(options);
    });
  };

};