var fs = require('fs'),
  path = require('path');

module.exports = (()=> {
  this.api = 'https://my.tanda.co/api/v2/';

  var init = (options) => {
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.scopes = options.scopes;
    this.redirect_url = options.redirect;
    // this should be a function that takes in a new refresh token and saves it to the DB
    this.updateRefresh = options.refresh;
    
    // add in some helper functions
    this._ = require('./lib');
    // TODO: add in function to add to the session/remove from the session
  };

  var express = (req, res, next) => {
    // somehow need to maintain here the req object
    // need to take the req.tanda.access_token and attach it to `this`
    // still not sure yet
  };

  var auth = require('./auth').call(this);
  this.request = require('./request').call(this);

  var objects = {
    init,
    auth
  };

  fs.readdirSync('./objects').forEach((object) => {
    objects[object.slice(0, -3)] = require(path.join(__dirname, 'objects', object)).call(this);
  });

  return objects;
})();