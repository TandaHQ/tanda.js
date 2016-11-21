import Endpoint from './Endpoint';
/**
 * {
      "time": 1459296900,
      "stat": 3.5,
      "type": "sales"
    }
 * A store stat
 * @typedef {Object} Stat
 * @property {String} type The type of the stat
 * @property {Number} time A unix timestamp start representing the time of the stat
 * @property {Number} stat The value of the stat
 */

/**
 * Store Stats
 */
export default class Storestats extends Endpoint {
  get(datastreamId, from, to, type = '') {
    return this.request(`${this.endpoint}/for_datastream/${datastreamId}/from/${from}/to/${to}`,
      'GET', {
        type,
      });
  }

  /**
   * Not an *actual* thing.  It's just a wrapper around {@link create}.  To remove stats, just set
   * them to zero
   * @param {Number} id The ID of the datastream
   * @param {Object|Stat} stats
   * @param {Stat[]} [stats.stats]
   * @returns {Promise<{id: {String}, ...Stat}>}
   */
  create(id, stats) {
    return this.request(`${this.endpoint}/for_datastream/${id}`, 'POST', stats);
  }

  /**
   * Not an *actual* thing.  It's just a wrapper around {@link create}.  To remove stats, just set
   * them to zero
   * @param {Number} id The ID of the datastream
   * @param {Object|Stat} stats
   * @param {Stat[]} [stats.stats]
   * @returns {Promise<{id: {String}, ...Stat}>}
   */
  remove(id, stats) {
    return this.create(id, stats);
  }
}
