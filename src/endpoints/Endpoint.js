export default class Endpoint {
  scopes = [];

  constructor(parent) {
    this.Tanda = parent;
  }

  get endpoint() {
    return `/${this.constructor.name.toLowerCase()}`;
  }

  /**
   * Localised request method
   * @param {String} endpoint The enpoint to post to
   * @param {String} method The HTTP method [GET, PUT, POST, DELETE]
   * @param {Array|Object} data The data to send.  For a get request, will be turned into URL params
   */
  request(endpoint, method, data) {
    return this.Tanda.request(endpoint, method, data);
  }
}
