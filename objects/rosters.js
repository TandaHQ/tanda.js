var Promise = require('bluebird');

module.exports = function(){
  let endpoint = 'rosters/';
  var get = (id, show_costs) => {
    var url = endpoint + id;
    if (show_costs){
      url += '?show_costs=true';
    }
    return this.request('GET', url);
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