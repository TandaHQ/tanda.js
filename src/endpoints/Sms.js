import Endpoint from './Endpoint';

export default class Sms extends Endpoint {
  async send(userIds, message) {
    if (message.length > 1580) {
      throw new Error('Messages cannot be longer than 1580 characters.');
    }

    return this.request(this.endpoint, 'POST', { message, user_ids: userIds });
  }

  status(id) {
    return this.request(`${this.endpoint}/${id}`);
  }
}
