/**
 * Node Tanda - A wrapper for Tanda's API
 * @module tanda
 */

import 'babel-polyfill';
import request from './lib/request';
import endpoints from './endpoints';

export default class Tanda {
  constructor(auth = {}) {
    this.auth = auth;
    this.loadEndpoints();
    this.request = request.bind(this);
  }

  loadEndpoints() {
    Object.entries(endpoints).forEach(([key, Value]) => {
      let name = key.replace('.js', '');
      name = name.charAt(0).toLowerCase() + name.slice(1);
      this[name] = new Value(this);
    });
  }
}

window.Tanda = Tanda;
