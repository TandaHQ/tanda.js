import Endpoint from './Endpoint';

export default class Users extends Endpoint {

  wages = false;

  get showWages() {
    this.wages = true;
    return this;
  }

  getShowWages() {
    const w = this.wages;
    this.wages = false;
    return { show_wages: w };
  }

  get(id) {
    if (id == null) {
      return this.request(this.endpoint, 'GET', this.getShowWages());
    }
    return this.request(`${this.endpoint}/${id}`, 'GET', this.getShowWages());
  }

  inactive() {
    return this.request(`${this.endpoint}/inactive`);
  }

  clockedIn() {
    return this.request(`${this.endpoint}/clocked_in`);
  }

  create(user) {
    return this.request(this.endpoint, 'POST', user);
  }

  update(id, update) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', update);
  }

  remove(id) {
    return this.request(`${this.endpoint}/${id}`, 'DELETE');
  }

}
