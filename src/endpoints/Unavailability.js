import Endpoint from './Endpoint';

export default class Unavailability extends Endpoint {

  /**
   * Get a request, or multiple requests.
   * If ID is a number, you'll receive a single request.  If it's an array, you'll receive
   * multiple requests.  Ids must be set, unless both `from` and `to` are set. You can set all
   * three if you like.
   * @param {Number|Number[]} ids The id(s) to query
   * @param {String} from An ISO8601 date representing the start of the search period
   * @param {String} to An ISO8601 date representing the end of the search period
   * @param {Number|Number[]} userIds The user ids who own the request(s).
   * @returns {Promise<Unavailability|Unavailability[]>}
   */
  async get({ ids, from, to, userIds}) {
    if (typeof ids === 'number' || typeof ids === 'string') {
      // singular request
      return this.request(`${this.endpoint}/${ids}`);
    }

    if (!ids || (!from && !to)) {
      throw new Error('You must specify either `ids` or both `from` and `to`.  You can specify' +
        ' both, if you like.');
    }

    return this.request(this.endpoint, 'GET', { ids, from, to, userIds });
  }

  /**
   * Create a new unavailability
   * @param {Number} userId The user id of the requester
   * @param {String} title The reason for the request
   * @param {Number} start A unix timestamp representing the start of the request
   * @param {Number} finish A unix timestamp representing the end of the request
   * @param {Object|Boolean} repeatingInfo False if the request doesn't repeat.
   * @param {String} [repeatingInfo.interval] The interval to repeat on.  e.g. 'day'
   * @param {Number} [repeatingInfo.occurrences] The number of occurrences of the interval
   */
  create({ userId, title, start, finish, repeatingInfo }) {
    let repeating = false;
    if (repeatingInfo instanceof Object) {
      repeating = true;
    }
    return this.request(this.endpoint, 'POST', {
      userId,
      title,
      start,
      finish,
      repeating,
      repeatingInfo,
    });
  }

  /**
   * Retrieve details about a repeating unavailability
   * @param {Number} id The unavailability request to retrieve information about
   * @returns {Promise<Unavailability[]>} An array of the related unavailabilities.
   */
  repeating(id) {
    return this.request(`${this.endpoint}/repeating_for/${id}`);
  }

  /**
   * Update an existing unavailability
   * @param {Number} id
   * @param {Object} update The update to apply
   * @param {String} update.title A new title. in the case of repeating unavailability, all of
   * the event’s titles will be updated
   * @returns {Promise<Unavailability>}
   */
  update(id, update) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', update);
  }

  /**
   * Removes an existing request
   * @param {Number} id The id of the unavailability
   * @returns {Promise<null>}
   */
  remove(id) {
    return this.request(`${this.endpoint}/${id}`, 'DELETE');
  }
}
