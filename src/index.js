/**
 * Node Tanda - A wrapper for Tanda's API
 * @module tanda
 */

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
    if (process.title === 'node') {
      return fs.readdirSync(path.join(__dirname, 'endpoints'))
        .filter(object => object.slice(-3) === '.js' && object !== 'Endpoint.js' && object === 'AwardTags.js')
        .forEach((object) => {
          const C = require(path.join(__dirname, 'endpoints', object)).default // eslint-disable-line
          this[object.slice(0, -3)] = new C(this);
        });
    }
    const requireContext = require.context('./endpoints', false, /.*\.js$/);
    return requireContext.keys().forEach((key) => {
      const k = key.replace('.js', '');
      if (k !== 'Endpoint') {
        this[k] = requireContext(k).default.bind(this);
      }
    });
  }
}
