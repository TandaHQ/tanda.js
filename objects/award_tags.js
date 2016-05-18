var Promise = require('bluebird');

module.exports = function(){
  let endpoint = '/award_tags';

  /**
   * Get a list of award tags.
   * @returns {Promise} Resolve: a list of award tags. Reject: {err : 'The error'}
   */
  var gets = () => {
    return this.request('GET', endpoint);
  }

  /**
   * Get a particular award tag based on its ID
   * @param {int} id - The id to find
   * @returns {Promise} Resolve: the award tag. Reject: {err : 'The error'}
   */
  var get = (id) => {
    var url = `${endpoint}/${id}`;
    return this.request('GET', url);
  }

  return {
    gets,
    get
  }
};