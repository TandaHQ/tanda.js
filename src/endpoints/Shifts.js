import Endpoint from './Endpoint';

export default class Shifts extends Endpoint {
  getGetParams() {
    return { ...this.getShowCosts(), ...this.getShowAward() };
  }

  get(ids, userIds, from, to) {
    if (ids instanceof Array || ids == null) {
      // get all
      return this.request(this.endpoint, 'GET', {
        ids, userIds, from, to, ...this.getGetParams(),
      });
    }

    return this.request(`${this.endpoint}/${ids}`, 'GET', this.getGetParams());
  }

  /**
   * Create a shift
   * @param {Object} shift The shift to create
   * @param {Number} shift.userId The ID of the user working the shift
   * @param {Date} shift.date The date of the shift
   * @param {Number} [shift.start] The start time as a Unix timestamp
   * @param {Number} [shift.finish] The end time of the shift as a Unix timestamp
   * @param {Number} [shift.departmentId] The department the shift was worked in
   * @param {Number} [shift.breakStart] The start time of the break as a Unix timestamp
   * @param {Number} [shift.breakFinish] The end time of the break as a Unix timestamp
   * @param {String} [shift.status] The status of the shift ('APPROVED' or 'PENDING')
   * @param {String} [shift.location] The name of the location the shift is in // FIXME
   * @param {Object[]} [shift.allowances] The id of the allowance
   * @param {Number} shift.allowances[].id The id of the allowance
   * @param {Number} shift.allowances[].value The value of the allowance
   * @param {String} [shift.subCostCentre] The sub cost centre the shift is in
   * @param {String} [shift.tag] The tag of the shift
   * @returns {Promise} Shift creation request
   */
  create(shift) {
    return this.request(this.endpoint, 'POST', shift);
  }

  update(id, update) {
    return this.request(`${this.endpoint}/${id}`, 'PUT', update);
  }

  remove(id) {
    return this.request(`${this.endpoint}/${id}`, 'DELETE');
  }

  applicableAllowances(id) {
    return this.request(`${this.endpoint}/${id}`);
  }
}
