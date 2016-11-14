/**
 * Timesheets
 * @module tanda/timesheets
 */

import Endpoint from './Endpoint';

export default class Timesheets extends Endpoint {

  showAward = false;

  get showAwardInterpretation() {
    this.showAward = true;
    return this;
  }

  getShowAward() {
    const a = this.showAward;
    this.showAward = false;
    return { show_award_interpretation: a };
  }

  getGetParams() {
    return { ...this.getShowAward(), ...this.getShowCosts() };
  }

  /**
   * View the current roster (containing today's date)
   * @returns {Promise}
   */
  current() {
    return this.request(`${this.endpoint}/current`, 'GET', this.getGetParams());
  }

  /**
   * Get the roster on a specified date
   * @param {Date} date ISO formatted date
   * @returns {Promise}
   */
  on(date) {
    return this.request(`${this.endpoint}/on/${date}`, 'GET', this.getGetParams());
  }

  /**
   * Get a roster for a user, on a date, or their current roster.
   * @param {int} userId - The user ID to look for
   * @returns {{function, function}} - Chainable methods to search for rosters.
   * {@link for#on|on} to search via date. {@link for#current} to search for the current roster.
   */
  for(userId) {
    return {
      current: () => this.request(`${this.endpoint}/for/${userId}/current`, this.getGetParams()),
      on: date => this.request(`${this.endpoint}/for/${userId}/on/${date}`, this.getGetParams()),
    };
  }

  /**
   * Get a roster by ID
   * @param {int} id The timesheet ID to search for
   * @returns {Promise}
   */
  get(id) {
    return this.request(`${this.endpoint}/${id}`, 'GET', this.getGetParams());
  }
}
