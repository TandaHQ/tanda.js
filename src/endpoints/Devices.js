import Endpoint from './Endpoint';

export default class Devices extends Endpoint {

  /**
   * Get devices, a particular device or all returned devices
   * @param {String|Number} [id] If empty, gets all devices.  If 'returned', gets returned
   * devices.  If a number, gets the device of that ID.
   * @returns {Promise}
   */
  get(id) {
    if (id == null) {
      // get all
      return this.request(this.endpoint);
    }

    return this.request(`${this.endpoint}/${id}`);
  }

  create(device) {
    return this.request(this.endpoint, 'POST', device);
  }

  update(id, update) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', update);
  }

  tickerMessages(id) {
    return this.request(`${this.endpoint}/${id}/ticker_messages`);
  }

  return(id) {
    return this.request(`${this.endpoint}/${id}/return`, 'POST');
  }
}
