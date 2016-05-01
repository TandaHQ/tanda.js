var Promise = require('bluebird');

module.exports = function(){
  let endpoint = 'rosters/';
  var get = (id, show_costs) => {
    return new Promise((resolve, reject) => {
      var url = endpoint + id;
      if (show_costs){
        url += '?show_costs=true';
      }
      this.request('GET', url)
        .then(function(body){
          return resolve(body);
        })
        .catch(function(err){
          return reject(err);
        });
    });
  };

  var current = (show_costs) => {
    var url = endpoint + 'current';
    if (show_costs) {
      url += '?show_costs=true'
    }
    return this.request('GET', url);
  };
  
  var on = (date, show_costs) => {
    var url = `${endpoint}on/${date}`;
    if (show_costs){
      url += '?show_costs=true';
    }
    return this.request('GET', url);
  };

  return {
    get,
    current,
    on
  }



};