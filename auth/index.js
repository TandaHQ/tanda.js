var request = require('request');

var globals, parent;

var init = function(g){
  globals = g;
};

var vars = {};

function start(options){
  var base_url = 'https://my.tanda.co/api/oauth/authorize?';
  options = options || null;
 
  /*
  Options prototype
  {
    appId : Application ID (string),
    redirect : Where tanda should redirect it's API result code to (string),
    scope : A single scope to request (string),
    scopes : A list of scopes to request ([string])
  }
  appId and redirect are required and one of scope or scopes is required, but no more.
   */
 
  // check options are present
  if (options == null){
    throw new SyntaxError('Options must be set');
  }

  if (!options.appId){
    throw new SyntaxError('Please provide an Application ID');
  }

  if (!options.redirect){
    throw new SyntaxError('Please provide a redirect');
  }

  if (!options.scope && !options.scopes){
    throw new SyntaxError('Please provide a scope or multiple scopes.');
  }

  if (options.scope && options.scopes){
    throw new SyntaxError('Cannot set both scope and scopes. One or the other.');
  }

  // check options are correct type
  if (typeof options.appId !== 'string'){
    throw new TypeError('Application ID must be a string');
  }

  if (typeof options.redirect !== 'string'){
    throw new TypeError('Redirect URI must be a string');
  }

  if (options.scope && typeof options.scope !== 'string'){
    throw new TypeError('Scope must be a string');
  }

  if (options.scopes){
    options.scopes.forEach(function(scope){
      if (typeof scope !== 'string'){
        throw new TypeError('Scopes must all be strings.');
      }
    });
  }

  var scope;
  if (options.scope){
    scope = options.scope;
  } else {
    scope = options.scopes.join('+');
  }

  vars.auth_url = base_url + 'scope=' + scope + '&client_id=' + options.appId
    + '&redirect_uri=' + options.redirect + '&response_type=code';
}

function receive(req, res, next){
  vars.code = req.query.code;
  token();
  next();
}

function token() {
  // gets the token
  var t = {};

}
//
