module.exports = function(){
  let endpoint = '/datastreams';

  var gets = () => {
    return this.request('GET', endpoint);
  };

  var create = (stream = {data_interval : 86400}) => {
    return new Promise(() => {
      const allowed_intervals = [86400, 3600, 1800, 1200, 900];  // [1 day, 1 hour, 30 minutes, 20 minutes, 15 minutes]
      if (allowed_intervals.indexOf(data_interval) < 0) throw Error(`Data interval must be one of ${allowed_intervals}`);
      return this.request('POST', endpoint, stream);
    });
  };

  var get = (id) => {
    return this.request('GET', `${endpoint}/${id}`);
  };

  var update = (id, update) => {
    return this.request('PUT', `${endpoint}/${id}`, update);
  };

  return {
    gets,
    create,
    get,
    update
  }


};