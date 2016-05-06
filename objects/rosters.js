var Promise = require('bluebird');

module.exports = function(){
  let endpoint = 'rosters/';
  var get = (id, show_costs) => {
    var url = endpoint + id + this._.show(show_costs);
    return this.request('GET', url);
  };

  var current = (show_costs) => {
    var url = endpoint + 'current' + this._.show(show_costs);
    return this.request('GET', url);
  };
  
  var on = (date, show_costs) => {
    var url = `${endpoint}on/${date}` + this._.show(show_costs);
    return this.request('GET', url);
  };

  return {
    get,
    current,
    on
  }



};