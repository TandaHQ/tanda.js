import Endpoint from './Endpoint';

export default class Departments extends Endpoint {

  get(departmentId) {
    if (departmentId == null) {
      return this.request(this.endpoint);
    }
    return this.request(`${this.endpoint}/${departmentId}`);
  }

  create(department) {
    return this.request(this.endpoint, 'POST', department);
  }

  update(departmentId, update) {
    return this.request(`${this.endpoint}/${departmentId}`, 'PUT', update);
  }

  remove(departmentId) {
    return this.request(`${this.endpoint}/${departmentId}`, 'DELETE');
  }

}
