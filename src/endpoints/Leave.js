import Endpoint from './Endpoint';

export default class Leave extends Endpoint {
  async get(id, from, to, users) {
    if (typeof id === 'number') {
      // getting a single leave request
      return this.request(`${this.endpoint}/${id}`);
    }

    if (!from && !to && !id) {
      throw new Error('You must specify either from and to, or ids of the requests');
    }

    return this.request(this.endpoint, 'GET', { from, to, user_ids: users, ids: id });
  }

  create(leave) {
    return this.request(this.endpoint, 'POST', leave);
  }

  update(id, update) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', update);
  }

  types(id) {
    return this.request(`${this.endpoint}/types_for/${id}`);
  }
}
