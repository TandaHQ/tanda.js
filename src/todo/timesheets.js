/**
 * Timesheets
 * @module tanda/timesheets
 */

var Promise = require('bluebird');

module.exports = function () {

  let endpoint = '/timesheets';
  var methods = {};

  /**
   * @function
   * View the current roster (containing today's date)
   * @param {boolean} show_costs - Show Costs?
   * @returns {Promise} Resolve: the current roster. Reject: {err : 'The error'}
   *
   */
  methods.current = (show_costs = false) => {
    var url = `${endpoint}/current` + this._.show(show_costs);
    return this.request('GET', url);
  };

  /**
   * @function
   * Get the roster on a specified date
   * @param {Date} date - ISO formatted date
   * @param {boolean} show_costs - Show Costs?
   * @returns {Promise} Resolve: the roster on `date`, if it exists. Reject: {err : 'The error'}
   */
  methods.on = (date, show_costs = false) => {
    var url = `${endpoint}/on/${date}` + this._.show(show_costs);
    return this.request('GET', url);
  };

  /**
   * @function
   * Get a roster for a user, on a date, or their current roster.
   * @param {int} user_id - The user ID to look for
   * @param {boolean} show_costs - Show Costs?
   * @returns {{function, function}} - Chainable methods to search for rosters. {@link for#on|on} to search via date. {@link for#current} to search for the current roster.
   */
  methods.for = (user_id, show_costs = false) => {
    var url = `${endpoint}/for/${user_id}/`;
    var further = {};

    /**
     * @function
     * Get the roster for `user_id` on `date`.
     * @param {Date} date - The date to search on
     * @returns {Promise} Resolve: the roster on `date`, for `user_id`, if it exists. Reject: {err : 'The error'}
     */
    further.on = (date) => {
      url += `on/${date}` + this._.show(show_costs);
      return this.request('GET', url);
    };

    /**
     * @function
     * Get the current roster for `user_id`.
     * @returns {Promise} Resolve: the current roster, for `user_id`, if it exists. Reject: {err : 'The error'}
     */
    further.current = () => {
      url += `current` + this._.show(show_costs);
      return new Promise((resolve, reject) => {
        this.request('GET', url)
          .then((res) => {
            if (res.message) {
              return reject({ err : `Timesheet doesn't exist` });
            }
            return resolve(res);
          });
      });
    };
    return further;
  };

  /**
   * @function
   * Get a roster by ID
   * @param {int} id - The timesheet ID to search for
   * @param {boolean} show_costs - Show Costs?
   * @returns {Promise} Resolve: the roster identified `id`. Reject: {err : 'The error'}
   */
  methods.get = (id, show_costs = false) => {
    var url = `${endpoint}/${id}` + this._.show(show_costs);
    return this.request('GET', url);
  };
  
  return methods;

};
