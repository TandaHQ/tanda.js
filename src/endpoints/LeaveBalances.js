import Endpoint from './Endpoint';

export default class LeaveBalances extends Endpoint {
  get(id) {
    if (typeof id === 'number') {
      // getting a leave balance
      return this.request(`${this.endpoint}/${id}`);
    }

    // id should be an array of user id's
    return this.request(this.endpoint, 'GET', id);
  }

  create(balance) {
    return this.request(this.endpoint, 'POST', balance);
  }

  update(id, update) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', update);
  }
}
