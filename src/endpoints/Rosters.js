import Endpoint from './Endpoint';

export default class Rosters extends Endpoint {

  /**
   *
   * @param {String|Number} id Set to current to get the current roster, or a rosterId to get
   * that roster
   * @returns {Promise}
   */
  get(id) {
    return this.request(`${this.endpoint}/${id}`, 'GET', this.getShowCosts());
  }

  on(date) {
    return this.request(`${this.endpoint}/on/${date}`, 'GET', this.getShowCosts());
  }
}
