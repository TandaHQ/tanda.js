var _req = require('request-promise'),
  Promise = require('bluebird');

let allowed_methods = ['GET', 'POST', 'PUT', 'DELETE'];

module.exports = function () {
  return (method, endpoint, data = {}) => {
    return new Promise((resolve, reject) => {
      if (allowed_methods.indexOf(method.toUpperCase()) < 0) {
        return reject({err: 'Invalid Request Method'});
      }
      // build request object
      var options = {
        method: method,
        uri: this.api + endpoint,
        resolveWithFullResponse: true,
        headers : {
          'Authorization' : 'Bearer ' + this.access_token
        },
        body : data,
        json: true
      };
      _req(options)
        .then(function(response){
          if (response.headers['X-RateLimit-RateLimited']){
            return reject({err : 'Rate Limit Reached'});
          }
          return resolve(JSON.parse(response.body));
        })
        .catch(function(err){
          reject(err);
        });
    });
  };

};