export default class Endpoint {
  scopes = [];

  constructor(parent) {
    this.Tanda = parent;
  }

  request(...args) {
    this.Tanda.request(...args);
  }
}
