import Endpoint from './Endpoint';

export default class Clockins extends Endpoint {

  async get(from, to, userId = '', deviceId = '') {
    if (typeof from === 'number') {
      // getting a specific clockin
      return await this.require(`${this.endpoint}/${from}`);
    }

    if (userId === '' && deviceId === '') {
      throw new Error('One of User ID or Device ID must be set.');
    }

    if (from === undefined || to === undefined) {
      throw new Error('From and To must be set.');
    }

    return await this.request(this.endpoint, 'GET', {
      from,
      to,
      user_id: userId,
      device_id: deviceId,
    });
  }

  async create({ userId, type, time = Date.now(), deviceId, tag, photo, departmentId }) {
    const allowedTypes = ['clockin', 'clockout'];
    if (!allowedTypes.includes(type)) {
      throw new Error(`Type must be one of ${allowedTypes}`);
    }

    if (!userId) {
      return new Error('userId must be set');
    }

    return await this.request(this.endpoint, 'POST', {
      type,
      time,
      tag,
      photo,
      device_id: deviceId,
      user_id: userId,
      department_id: departmentId,
    });
  }
}
