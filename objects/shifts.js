var Promise = require('bluebird');

module.exports = function(){
  let endpoint = '/shifts';

  var methods = {};

  /**
   * Get a list of shifts
   * @param {Array} ids - array of ids to query
   * @param {boolean} show_costs - Show Costs?
   * @returns {Promise} Resolve: an array of shifts matching the provided ids. Reject: {err : 'The error'}
   */
  methods.gets = (ids, show_costs = false) => {
    var url = `${endpoint}?ids=${ids.join(',')}` + this._.show(show_costs, false);
    return this.request('GET', url);
  };

  /**
   * Create a shift
   * @param {object} shift - The shift object to create
   * @returns {Promise} Resolve: the new shift, as it exists on the server. Reject: {err : 'The error'}
   */
  methods.create = (shift) => {
    return this.request('POST', endpoint, shift);
  };

  /**
   * Get a shift by ID.
   * @param {int} id - the ID to search for
   * @param {boolean} show_costs - Show Costs?
   * @returns {Promise} Resolve: the shift matching the id. Reject: {err : 'The error'}
   */
  methods.get = (id, show_costs = false) => {
    var url = `${endpoint}/${id}${this._.show(show_costs)}`;
    return this.request('GET', url);
  };

  /**
   * Update a shift with the values in `update`
   * @param {int} id - The id of the shift to update
   * @param {object} update - values to update - anything in this will be overwritten on the server
   * @returns {Promise} Resolve: the updated shift from the server. Reject: {err : 'The error'}
   */
  methods.update = (id, update) => {
    var url = `${endpoint}/${id}`;
    return this.request('PUT', url, update);
  };

  /**
   * Delete a shift
   * @param {int} id - Shift to delete
   * @returns {Promise} Resolve: nothing (status 204 is success). Reject: {err : 'The error}
   */
  methods.delete = (id) => {
    return this.request('DELETE', `${endpoint}/${id}`);
  }

};