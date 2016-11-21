import Endpoint from './Endpoint';

export default class AwardTags extends Endpoint {
  scopes = [];
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
}
