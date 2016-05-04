var _req = require('request-promise'),
  Promise = require('bluebird');

module.exports = function(){
  var buildUrl = () => {
    var scopes;
    if (typeof this.scopes === 'object'){
      scopes = '' + this.scopes.join(' ');
    } else {
      scopes = this.scopes;
    }
    return `${this.api.slice(0, -3)}oauth/authorize?scope=${scopes}&client_id=${this.client_id}`
      + `&redirect_uri=${this.redirect_url}&response_type=code`;
  };

  var authorize = (req, res, next) => {
    console.log('auth.authorize');
    console.log(this);
    this.test_thing = 123456;
    if (req.query.code){
      // action the response from Tanda.
      token(req, next, req.query.code)
        .then(() => {
          // save the refresh_token into the database for that user.
          next();
        })
        .catch((err) => {
          next(err);
        })
    } else {
      // send the client to Tanda to authorize
      res.redirect(buildUrl());
    }
  };

  /**
   * refresh the user's token if it expires
   * @param {string} refresh_token - The user's refresh token
   */
  var refresh = (refresh_token) => {
    return new Promise((resolve, reject) => {
      // build the request object
      var options = {
          method: 'POST',
          uri: this.api.slice(0, -3) + 'oauth/token',
          form: {
            client_id : this.client_id,
            client_secret : this.client_secret,
            refresh_token,
            redirect_uri : buildUrl(),
            grant_type : 'refresh_token'
          },
          json: true
      };
      _req(options)
        .then((body) => {
          // update the token into the DB/whatever user is doing with it
          this.refreshToken(body.refresh_token);
          // TODO: figure out neatest way of attaching access_token + expires to req.tanda
          // Maybe just attach it to the session, and pull it out + attach it in the express function
        })
        .catch((err) => {
          reject(err);
        })

    });
  };

  var token = (req, next, code) => {
    return new Promise((resolve, reject) => {
      // build the object to send
      var options = {
        method: 'POST',
        uri: this.api.slice(0, -3) + 'oauth/token',
        form: {
          client_id : this.client_id,
          client_secret : this.client_secret,
          code,
          redirect_uri : this.redirect_url,
          grant_type : 'authorization_code'
        },
        json: true
      };
      console.log(options);
      _req(options)
        .then((res) => {
          req.tanda = {
            access_token : res.access_token,
            expires : res.created_at + res.expires_in,
            refresh_token : res.refresh_token
          };
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });

  };

  return {
    authorize,
    refresh
  }
};