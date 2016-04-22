var request = require('request');

var vars = {
  client_id : '',
  client_secret : '',
  api_base : 'https://my.tanda.co/api/'
};

module.exports = t = {
  
  init : function(client_id, client_secret){
    vars.client_id = client_id;
    vars.client_secret = client_secret;
  },
  
  checkVars : function(){
    console.log(vars);
  },

  auth : {
    vars : {
    },
    init : function(options){
      console.log(this);
      var base_url = vars.api_base + 'oauth/authorize?';
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
      if (options.scope) {
        scope = options.scope;
      } else {
        scope = options.scopes.join(' ');
      }
      
      this.vars.redirect_url = base_url + 'scope=' + scope + '&client_id=' + vars.client_id
        + '&redirect_uri=' + options.redirect + '&response_type=code';
    },
    request : function(req, res, next){
      res.redirect(t.auth.vars.redirect_url);
    },
    receive : function(req, res, next){
      console.log(t);
      t.auth.vars.code = req.query.code;
      console.log(t.auth.vars);
      console.log(t.auth);
      t.auth.token(next);
    },
    token : function(next){
      var data = {
        client_id : vars.client_id,
        client_secret : vars.client_secret,
        code : t.auth.vars.code,
        redirect_uri : 'http://localhost:3000/callback',
        grant_type : 'authorization_code'
      };
      console.log(data);
      request.post(vars.api_base + 'oauth/token', {form : data},function(err, resp){
        if (err) throw err;
        var body = JSON.parse(resp.body);
        console.log(body);
        vars.access_token = body.access_token;
        vars.expires = body.created_at + body.expires_in;
        vars.refresh_token = body.refresh_token;
        next();
      });
    },
    validateToken : function(){
      if (vars.expires > Date.now()){
        t.auth.refresh();
      }
    },
    refresh : function(){
      // do the refresh
    }
    
  }

};