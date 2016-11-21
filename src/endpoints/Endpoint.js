export default class Endpoint {

  constructor(parent) {
    this.Tanda = parent;
  }

  /**
   * Converts the name of the class to the equivalent Tanda URL endpoint
   * @returns {string} The endpoint
   */
  get endpoint() {
    return this.constructor.name.split(/(?=[A-Z])/).map(piece => piece.toLowerCase()).join('_');
  }

  show = false;

  get showCosts() {
    this.show = true;
    return this;
  }

  getShowCosts() {
    const s = this.show;
    this.show = false;
    return { show_costs: s };
  }

  showAward = false;

  get showAwardInterpretation() {
    this.showAward = true;
    return this;
  }

  getShowAward() {
    const a = this.showAward;
    this.showAward = false;
    return { show_award_interpretation: a };
  }

  validateRequest() {
    console.log(this.scopes);
    console.log(this.Tanda.auth);
    if (!this.Tanda.auth ||
      (this.Tanda.auth && !this.Tanda.auth.scopes && !this.Tanda.auth.access_token)
    ) {
      throw new Error('Make sure you have authentication before making requests');
    }
    const remaining = this.scopes.filter(scope => !this.Tanda.auth.scopes.includes(scope));
    if (remaining.length > 0) {
      throw new Error(`Scopes for this call are missing.  Please add ${remaining}`);
    }
  }

  /**
   * Localised request method
   * @param {String} endpoint The enpoint to post to
   * @param {String} [method=GET] The HTTP method [GET, PUT, POST, DELETE]
   * @param {Array|Object} data The data to send.  For a get request, will be turned into URL params
   */
  async request(endpoint, method = 'GET', data) {
    this.validateRequest();
    return this.Tanda.request(endpoint, method, data);
  }
}
