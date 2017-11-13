import Endpoint from './Endpoint';

export default class Datastreams extends Endpoint {
  get(id = null) {
    if (id) {
      return this.request(`${this.endpoint}/${id}`);
    }
    return this.request(this.endpoint, 'GET');
  }

  create({ name, dataInterval }) {
    const allowedIntervals = [86400, 3600, 1800, 1200, 900];
    return new Promise((resolve, reject) => {
      if (!allowedIntervals.includes(dataInterval)) {
        return reject(new Error(`Data interval must be one of ${allowedIntervals}`));
      }

      return this.request(this.endpoint, 'POST', { name, data_interval: dataInterval });
    });
  }

  update(id, { name, enabled }) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', { name, enabled });
  }
}
