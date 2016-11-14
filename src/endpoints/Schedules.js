import Endpoint from './Endpoint';

export default class Schedules extends Endpoint {

  include = false;

  get includeNames() {
    this.include = true;
    return this;
  }

  getInclude() {
    const i = this.include;
    this.include = false;
    return { include_names: i };
  }

  get(id) {
    if (id == null) {
      return this.request(this.endpoint, 'GET', { ...this.getInclude(), ...this.getShowCosts() });
    }

    return this.request(`${this.endpoint}/${id}`, 'GET', this.getShowCosts());
  }

  async getByUser(from, to, userIds) {
    // flagged values need to be gotten first so they're definitely reset
    const flagged = { ...this.getInclude(), ...this.getShowCosts() };

    if (!from || !to) {
      throw new Error('from and to are required');
    }

    return await this.request(this.endpoint, 'GET', {
      from, to, user_ids: userIds, ...flagged });
  }

  create(schedule) {
    return this.request(this.endpoint, 'POST', schedule);
  }

  update(id, update) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', update);
  }

  remove(id) {
    return this.request(`${this.endpoint}/${id}`, 'DELETE');
  }

}
