//var Promise = require('bluebird');

module.exports = function () {
  let endpoint = '/clockins';

  const get = ({user_id = '', device_id = '', from, to}) => {
    return new Promise(() => {
      if (user_id === '' && device_id === '') {
        throw Error("tanda.clockins: One of User ID or Device ID must be set.");
      }
      if (from === undefined || to === undefined) {
        throw Error("tanda.clockins: From and To must be set.");
      }
      let query = `?from=${from}&to=${to}`;
      if (user_id !== '') query += `&user_id=${user_id}`;
      if (device_id !== '') query += `&device_id=${device_id}`;

      return this.request('GET', `${endpoint}${query}`);
    });
  };

  const create = ({user_id = '', type = 'clockin', time = Date.now(), device_id = null, tag = null}) => {
    return new Promise(() => {
      const allowed_types= ['clockin', 'clockout'];
      if (user_id === '') throw Error("You must specify a User ID.");

      if (allowed_types.indexOf(type) < 0){
        // this type is not allowed
        throw Error(`tanda.clockins: Type must be one of ${allowed_types}`);
      }

      return this.request('POST', endpoint, {
        // it's a pity I have to rebuild this here.
        user_id,
        type,
        time,
        device_id,
        tag
      })
      
    });
  };

  return {
    get,
    create
  }
};