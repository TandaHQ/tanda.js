import Endpoint from './Endpoint';

export default class AwardTags extends Endpoint {
  endpoint = '/award_tags';

  /**
   * Get a list of award tags.
   * @returns {Promise} Resolve: a list of award tags. Reject: {err : 'The error'}
   */
  get(id = null) {
    if (id) {
      return this.request(`${this.endpoint}/${id}`);
    }
    return this.request(this.endpoint, 'GET');
  }

  /**
   * Get a particular award tag based on its ID
   * @param {int} id - The id to find
   * @returns {Promise} Resolve: the award tag. Reject: {err : 'The error'}
   */
  getDeprecated() {

  }
}
