module.exports = (()=> {
  this.api = 'https://my.tanda.co/api/v2/';

  var init = (options) => {
    this.client_id = options.client_id;
    this.client_secret = options.client_secret;
    this.scopes = options.scopes;
    this.redirect_url = options.redirect;
    // this should be a function that takes in a new refresh token and saves it to the DB
    this.updateRefresh = options.refresh;
    // TODO: add in function to add to the session/remove from the session
  };

  var express = (req, res, next) => {
    // somehow need to maintain here the req object
    // need to take the req.tanda.access_token and attach it to `this`
    // 
  };
  
  var auth = require('./auth').call(this);
  this.request = require('./request').call(this);

  return {
    init,
    auth,
    express,
    request : this.request
  }
})();