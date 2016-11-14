/**
 * Node Tanda - A wrapper for Tanda's API
 * @module tanda
 */

import 'babel-polyfill';
import fs from 'fs';
import path from 'path';
import request from './lib/request';

export default class Tanda {
  constructor(auth = {}) {
    this.auth = auth;
    this.loadEndpoints();
    this.request = request.bind(this);
  }

  loadEndpoints() {
    if (process && process.title === 'node') {
      return fs.readdirSync(path.join(__dirname, 'endpoints'))
        .filter(object => object.slice(-3) === '.js' && object !== 'Endpoint.js')
        .forEach((object) => {
          const name = object.replace('.js', '');
          const C = require(path.join(__dirname, 'endpoints', object)).default; // eslint-disable-line
          this[name.charAt(0).toLowerCase() + name.slice(1)] = new C(this);
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
