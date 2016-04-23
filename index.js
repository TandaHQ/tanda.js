var request = require('request'),
  Promise = require('bluebird');

var vars = {
  client_id: '',
  client_secret: '',
  api_base: 'https://my.tanda.co/api/'
};

var t = {

  init: function (client_id, client_secret) {
    vars.client_id = client_id;
    vars.client_secret = client_secret;
  },

  checkVars: function () {
    console.log(vars);
  },

  auth: {
    vars: {},
    init: function (options) {
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
      if (options == null) {
        throw new SyntaxError('Options must be set');
      }

      if (!options.redirect) {
        throw new SyntaxError('Please provide a redirect');
      }

      if (!options.scope && !options.scopes) {
        throw new SyntaxError('Please provide a scope or multiple scopes.');
      }

      if (options.scope && options.scopes) {
        throw new SyntaxError('Cannot set both scope and scopes. One or the other.');
      }

      // check options are correct type

      if (typeof options.redirect !== 'string') {
        throw new TypeError('Redirect URI must be a string');
      }

      if (options.scope && typeof options.scope !== 'string') {
        throw new TypeError('Scope must be a string');
      }

      if (options.scopes) {
        options.scopes.forEach(function (scope) {
          if (typeof scope !== 'string') {
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
      t.auth.vars.redirect_uri = options.redirect;

      this.vars.redirect_url = base_url + 'scope=' + scope + '&client_id=' + vars.client_id
        + '&redirect_uri=' + options.redirect + '&response_type=code';
    },
    request: function (req, res, next) {

      res.redirect(t.auth.vars.redirect_url);
    },
    receive: function (req, res, next) {
      t.auth.vars.code = req.query.code;
      t.auth.token(req, next);
    },
    token: function (req, next) {
      var data = {
        client_id: vars.client_id,
        client_secret: vars.client_secret,
        code: t.auth.vars.code,
        redirect_uri: t.auth.vars.redirect_uri,
        grant_type: 'authorization_code'
      };
      request.post(vars.api_base + 'oauth/token', {form: data}, function (err, resp) {
        if (err) throw err;
        var body = JSON.parse(resp.body);
        vars.access_token = body.access_token;
        vars.expires = body.created_at + body.expires_in;
        vars.refresh_token = body.refresh_token;
        req.client = {
          access_token : vars.access_token,
          expires : vars.expires,
          refresh_token : vars.refresh_token
        };
        next();
      });
    },
    validate: function () {
      // do the refresh
      return new Promise(function (resolve, reject) {
        if (vars.expires < Date.now()) {
          return resolve();
        }
        var data = {
          client_id: vars.client_id,
          client_secret: vars.client_secret,
          code: t.auth.vars.code,
          redirect_uri: t.auth.vars.redirect_uri,
          grant_type: 'authorization_code'
        };
        request.post(vars.api_base + 'oauth/token', {form: data}, function (err, resp) {
          if (err) return reject(err);
          var body = JSON.parse(resp.body);
          vars.access_token = body.access_token;
          vars.expires = body.created_at + body.expires_in;
          vars.refresh_token = body.refresh_token;
          resolve();
        });
      });
    },
    serialize : function(fn){
      vars.serialize = fn;
    },
    deserialize : function(fn){
      vars.deserialize = fn;
    }

  },

  request: function (method, endpoint, body) {
    return new Promise(function (resolve, reject) {
      if (!vars.expires) {
        throw new Error("Please run auth init/request/receive before making API calls");
      }
      t.auth.validate().then(function () {
        var req = {
          method: method.toUpperCase(),
          uri: vars.api_base + endpoint,
          headers: {
            "Authorization": "bearer " + vars.access_token
          }
        };
        if (body) {
          req.form = body;
        }
        request(req, function (err, resp, body) {
          if (err) return reject(err);
          if (resp.headers['X-RateLimit-RatedLimited'] == 'true') {
            return reject('Rate Limited.');
          }
          vars.test = JSON.parse(body);
          resolve({resp : resp, body : JSON.parse(body)});
        });
      }).catch(function (err) {
        reject(err);
      });
    });
  },

  users: {
    vars: {
      base : 'v2/users/'
    },
    get : function(){
      return new Promise(function(resolve, reject){
        t.request('GET', t.users.vars.base + '?show_wages=true')
          .then(function(resp){
            resolve(resp.body);
          })
      });
    },
    getUserById: function (id) {
      return new Promise(function (resolve, reject) {
        t.request('GET', t.users.vars.base + id + '?show_wages=true')
          .then(function (resp) {
            var body = resp.body;
            var user = {
              id: body.id,
              name: body.name,
              phone_number: body.phone,
              hourly: body.hourly_rate
            };
            resolve(user);
          })
          .catch(function (err) {
            reject(err);
          })
      });
    },
    getUserByPhoneNumber: function (number) {
      return new Promise(function(resolve, reject){
        t.request('GET', t.users.vars.base + '?show_wages=true')
          .then(function(response){
            response.body.forEach(function(user){
              if (user.phone == number){
                return resolve({
                  id : user.id,
                  name : user.name,
                  phone_number : user.phone,
                  hourly : user.hourly_rate
                });
              }
              resolve({err : "User with that number was not found."});
            })
          })
          .catch(function(err){
            reject(err);
          });
      });
    },
    getUserByName : function(name){
      return new Promise(function(resolve, reject){
        var returnUsers = [];
        t.users.get()
          .then(function(users){
            users.forEach(function(user){
              if (user.name.toLowerCase() == name.toLowerCase()){
                returnUsers.push({
                  id : user.id,
                  name : user.name,
                  phone_number : user.phone,
                  hourly : user.hourly_rate
                });
              } else {
                var split = user.name.split(' ');
                for(var i = 0; i< split.length; i++){
                  if (split[i].toLowerCase() == name.toLowerCase()){
                    returnUsers.push({
                      id : user.id,
                      name : user.name,
                      phone_number : user.phone,
                      hourly : user.hourly_rate
                    });
                    break;
                  }
                }
              }
            });
            if (returnUsers.length == 1){
              resolve(returnUsers[0]);
            } else {
              resolve(returnUsers);
            }
          })
      });
    }
  },

  rosters : {
    vars : {base : vars.api_base + 'v2/rosters/'},
    on : function(date){
      // returns the schedules for the date
      return new Promise(function(resolve, reject){
        t.request('GET', t.rosters.vars.base + "on/" + date)
          .then(function(resp, body){
            if (resp.statusCode == 204){
              return resolve({err : "There is no roster for that date"});
            }
            for(var i = 0; i < body.schedules.length; i++){
              var schedule = body.schedules[i];
              if (schedule.date == date){
                return resolve(schedule.schedules);
              }
            }
          })
          .catch(function(err){
            reject(err);
          })
      });
    },
    containing : function(date){
      return new Promise(function(resolve, reject){
        t.request('GET', t.rosters.vars.base + "on/" + date)
          .then(function(resp, body){
            if (resp.statusCode == 204){
              return resolve({err : "There is no roster for that date"});
            }
            return body;
          })
          .catch(function(err){
            reject(err);
          })
      });
    },
    get : function(id){
      return new Promise(function(resolve, reject){
        t.request('GET', t.rosters.vars.base + '/' + id)
          .then(function(resp, body){

          })
          .catch(function(err){
            reject(err);
          })
      });
    }
  },

  shifts : {
    vars : {base : vars.api_base + 'v2/shifts/'},
    get : function (id) {
      return new Promise(function(resolve, reject) {
        t.request('GET', t.shifts.vars.base + id + '?show_costs=true')
          .then(function(resp, body) {
            return resolve(body);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    },

    update : function (id, newStart, newFinish) {
      return new Promise(function(resolve, reject) {
        t.request('PUT', t.shifts.vars.base + id, {'start': newStart, 'finish': newFinish})
          .then(function(resp, body) {
            return resolve(body);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    },

    delete : function (id) {
      return new Promise(function(resolve, reject) {
        t.request('DELETE', t.shifts.vars.base + id)
          .then(function(resp, body) {
            return resolve({'success' : true});
          })
          .catch(function(err) {
            reject(err);
          })
      });
    },

    approve : function (id) {
      return new Promise(function(resolve, reject) {
        t.request('PUT', t.shifts.vars.base + id, {'status': 'APPROVED'})
          .then(function(resp, body) {
            return resolve(body);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    },

    create : function (shift) {
      return new Promise(function(resolve, reject) {
        if(!(shift && shift.user_id && shift.date && shift.start && shift.finish && shift.location)) {
          return resolve({err : "Malformed shift object"});
        }

        t.request('POST', t.shifts.vars.base, shift)
          .then(function(resp, body) {
            return resolve(body);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    }
  },

  schedules : {
    vars : {base : vars.api_base + 'v2/schedules'},
    get : function(id) {
      return new Promise(function(resolve, reject) {
        t.request('GET', t.schedules.vars.base + id + '?show_costs=true')
          .then(function(resp, body) {
            return resolve(body);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    },

    update : function (schedule) {
      return new Promise(function(resolve, reject) {
        t.request('PUT', t.schedules.vars.base + id, schedule)
          .then(function(resp, body) {
            return resolve(body);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    },

    delete : function (id) {
      return new Promise(function(resolve, reject) {
        t.request('DELETE', t.schedules.vars.base + id)
          .then(function(resp, body) {
            return resolve({'success' : true});
          })
          .catch(function(err) {
            reject(err);
          })
      });
    },

    create : function (schedule) {
      return new Promise(function(resolve, reject) {
        t.request('POST', t.schedules.vars.base, schedule)
          .then(function(resp, body) {
            return resolve(body);
          })
          .catch(function(err) {
            reject(err);
          })
      });
    }
  }
};

module.exports = t;