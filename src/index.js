/**
 * Node Tanda - A wrapper for Tanda's API
 * @module tanda
 */

import 'babel-polyfill';
import fs from 'fs';
import path from 'path';

export default class Tanda {
  constructor(auth = {}) {
    this.auth = auth;
    this.loadEndpoints();
  }

  request(endpoint, method, data) {
    // do some kind of authed request
    console.log(this.auth, data);
  }

  loadEndpoints() {
    if (process && process.title === 'node') {
      return fs.readdirSync(path.join(__dirname, 'endpoints'))
        .filter(object => object.slice(-3) === '.js' && object !== 'Endpoint.js')
        .forEach((object) => {
          console.log(object);
          const C = require(path.join(__dirname, 'endpoints', object)).default; // eslint-disable-line
          this[object.slice(0, -3)] = new C(this);
        });
    }
    const requireContext = require.context('./endpoints', false, /.*\.js$/);
    return requireContext.keys().forEach((key) => {
      const k = key.replace('.js', '');
      if (k !== 'Endpoint') {
        this[k] = new requireContext(k).default(this); // eslint-disable-line
      }
    });
  }
}
