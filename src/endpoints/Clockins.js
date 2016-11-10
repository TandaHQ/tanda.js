import Endpoint from './Endpoint';

export default class Clockins extends Endpoint {

  endpoint = '/clockins';

  get(from, to, userId = '', deviceId = '') {
    return new Promise((resolve, reject) => {
      if (userId === '' && deviceId === '') {
        return reject(new Error('One of User ID or Device ID must be set.'));
      }

      if (from === undefined || to === undefined) {
        return reject(new Error('From and To must be set.'));
      }

      return resolve(this.request(this.endpoint, 'GET', {
        from,
        to,
        user_id: userId,
        device_id: deviceId,
      }));
    });
  }

  create({ userId, type, time = Date.now(), deviceId, tag }) {
    const allowedTypes = ['clockin', 'clockout'];

    return new Promise((resolve, reject) => {
      if (!allowedTypes.includes(type)) {
        return reject(new Error(`Type must be one of ${allowedTypes}`));
      }

      if (!userId) {
        return reject(new Error('userId must be set'));
      }

      return resolve(this.request(this.endpoint, 'POST', {
        type,
        time,
        tag,
        device_id: deviceId,
        user_id: userId,
      }));
    });
  }
}
