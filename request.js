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
        uri: this.api + this.version + endpoint,
        resolveWithFullResponse: true,
        headers : {
          'Authorization' : 'Bearer ' + this.access_token
        },
        body : data,
        json: true
      };
      console.log('-------- REQUEST ---------');
      console.log(options);
      _req(options)
        .then(function(response){
          console.log('------ RESPONSE --------');
          console.log(response.headers);
          console.log('status');
          console.log(response.statusCode);
          console.log('body');
          console.log(response.body);
          console.log(typeof response.body);
          if (response.headers['X-RateLimit-RateLimited']){
            return reject({err : 'Rate Limit Reached'});
          }
          if (response.statusCode == 204) {
            return resolve({ message : 'No Content' });
          }
          return resolve(response.body);
        })
        .catch(function(err){
          reject(err);
        });
    });
  };

};
