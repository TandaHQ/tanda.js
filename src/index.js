/**
 * Node Tanda - A wrapper for Tanda's API
 * @module tanda
 */

import 'babel-polyfill';
import request from './lib/request';
import endpoints from './endpoints';
import authenticators from './authenticators';

export default class Tanda {

  api = process.env.API_URL || 'https://my.tanda.co/api';

  constructor(scopes = [], auth = {}) {
    this.scopes = scopes;
    this.auth = auth;
    this.loadEndpoints();
    this.loadAuthenticators();
    this.request = request.bind(this);
  }

  loadEndpoints() {
    Object.entries(endpoints).forEach(([key, Value]) => {
      let name = key.replace('.js', '');
      name = name.charAt(0).toLowerCase() + name.slice(1);
      this[name] = new Value(this);
    });
  }

  loadAuthenticators() {
    this.authenticators = {};
    Object.entries(authenticators).forEach(([key, value]) => {
      this.authenticators[key] = value.bind(this);
    });
  }

}

window.Tanda = Tanda;
