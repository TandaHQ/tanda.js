var request = require('request'),
  Promise = require('bluebird');

var vars = {
  client_id: '',
  client_secret: '',
  api_base: 'https://my.tanda.co/api/'
};

/*
   "Sugar Methods" provide additional functionality on top of the Tanda API by performing some common interactions
   in the wrapper so you don't need to write the same boilerplate a bunch of times.  They are not forced on you.  Only
   use them if you wish.
*/

// TODO: make sure all these calls are only using one return call for the promise
// TODO: Add in validation/error checking

var t = {

  init: function (client_id, client_secret) {
    vars.client_id = client_id;
    vars.client_secret = client_secret;
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
        this.scope = options.scope;
      } else {
        scope = options.scopes.join(' ');
        this.scope = options.scopes;
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
          access_token: vars.access_token,
          expires: vars.expires,
          refresh_token: vars.refresh_token
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
    serialize: function (fn) {
      vars.serialize = fn;
    },
    deserialize: function (fn) {
      vars.deserialize = fn;
    }
  },

  /*

   Standard request method for all API calls.

   Resolves it's promise with an object {response, body}

   */

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
          resolve({"response": resp, body: JSON.parse(body)});
        });
      }).catch(function (err) {
        reject(err);
      });
    });
  },

  rosters: {
    vars: {base: 'v2/rosters/'},

    get: function (id, show_costs) {
      var url = this.vars.base + id;
      if (show_costs) {
        url += '?show_costs=true'
      }
      return new Promise(function (resolve, reject) {
        t.request('GET', url)
          .then(function (res) {
            return resolve(res.body);
          })
          .catch(function (err) {
            return reject(err);
          })
      });
    },

    current: function (show_costs) {
      var url = this.vars.base + 'current';
      if (show_costs) {
        url += '?show_costs=true'
      }
      return new Promise(function (resolve, reject) {
        t.request('GET', url)
          .then(function (res) {
            return resolve(res.body);
          })
          .catch(function (err) {
            return reject(err);
          })
      });
    },

    contains: function (date, show_costs) {
      return new Promise(function (resolve, reject) {
        var url = this.vars.base + 'on/' + date;
        if (show_costs){
          url += '?show_costs=true'
        }
        t.request('GET', url)
          .then(function (res) {
            if (resp.statusCode == 204) {
              return reject({err: "There is no roster for that date"});
            }
            return resolve(res.body);
          })
          .catch(function (err) {
            reject(err);
          })
      });
    },

    // --------- Sugar Methods --------------

    onDate: function (date) {
      // returns the schedules for the date
      return new Promise(function (resolve, reject) {
        t.request('GET', t.rosters.vars.base + "on/" + date)
          .then(function (res) {
            if (res.response.statusCode == 204) {
              return reject({err: "There is no roster for that date"});
            }
            for (var i = 0; i < res.body.schedules.length; i++) {
              var schedule = res.body.schedules[i];
              if (schedule.date == date) {
                return resolve(schedule.schedules);
              }
            }
            return reject({err : 'That roster should exist, but it wasn\'t found.'});
          })
          .catch(function (err) {
            reject(err);
          })
      });
    }
  },

  schedules: {
    vars: {base: 'v2/schedules/'},
    gets: function (ids, show_costs) {
      return new Promise(function (resolve, reject) {
          var url = this.vars.base + 'schedules?ids=';
          if (ids) {
            if (typeof ids == 'object') {
              url += ids.join(',');
            } else {
              return reject('Invalid IDs.  If you are looking for just one, try `tanda.schedules.get(id)`.  Otherwise, pass in' +
                'an array of IDs to look for');
            }
          }
          if (show_costs){
            url += '&show_costs = true';
          }
          t.request('GET', url)
            .then(function(res){
              return resolve(res.body);
            })
            .catch(function(err){
              return reject(err);
            })
        }
      )
    },

    create: function (schedule) {
      return new Promise(function (resolve, reject) {
        t.request('POST', this.vars.base, schedule)
          .then(function (res) {
            return resolve(res.body);
          })
          .catch(function (err) {
            return reject(err);
          })
      });
    },

    get: function (id, show_costs) {
      return new Promise(function (resolve, reject) {
        var url = this.vars.base + id;
        if (show_costs){
          url += '?show_costs=true'
        }
        t.request('GET', url)
          .then(function (res) {
            return resolve(res.body);
          })
          .catch(function (err) {
            return reject(err);
          })
      });
    },

    update: function (id, update) {
      return new Promise(function (resolve, reject) {
        t.request('PUT', this.vars.base + id, update)
          .then(function (res) {
            return resolve(res.body);
          })
          .catch(function (err) {
            return reject(err);
          })
      });
    },

    delete: function (id) {
      return new Promise(function (resolve, reject) {
        t.request('DELETE', t.schedules.vars.base + id)
          .then(function (res) {
            if (res.response.statusCode == 204){
              return resolve({'success': true});
            } else {
              reject(res.response);
            }
          })
          .catch(function (err) {
            reject(err);
          })
      });
    }
  },

  timesheets: {},

  shifts: {
    vars: {base: 'v2/shifts/'},
    get: function (id) {
      return new Promise(function (resolve, reject) {
        t.request('GET', t.shifts.vars.base + id + '?show_costs=true')
          .then(function (resp, body) {
            return resolve(body);
          })
          .catch(function (err) {
            reject(err);
          })
      });
    },

    update: function (id, newStart, newFinish) {
      return new Promise(function (resolve, reject) {
        t.request('PUT', t.shifts.vars.base + id, {'start': newStart, 'finish': newFinish})
          .then(function (resp, body) {
            return resolve(body);
          })
          .catch(function (err) {
            reject(err);
          })
      });
    },

    delete: function (id) {
      return new Promise(function (resolve, reject) {
        t.request('DELETE', t.shifts.vars.base + id)
          .then(function (resp, body) {
            return resolve({'success': true});
          })
          .catch(function (err) {
            reject(err);
          })
      });
    },

    approve: function (id) {
      return new Promise(function (resolve, reject) {
        t.request('PUT', t.shifts.vars.base + id, {'status': 'APPROVED'})
          .then(function (resp, body) {
            return resolve(body);
          })
          .catch(function (err) {
            reject(err);
          })
      });
    },

    create: function (shift) {
      return new Promise(function (resolve, reject) {
        if (!(shift && shift.user_id && shift.date && shift.start && shift.finish && shift.location)) {
          return resolve({err: "Malformed shift object"});
        }

        t.request('POST', t.shifts.vars.base, shift)
          .then(function (resp, body) {
            return resolve(body);
          })
          .catch(function (err) {
            reject(err);
          })
      });
    }
  },

  users: {
    vars: {
      base: 'v2/users/'
    },
    get: function () {
      return new Promise(function (resolve, reject) {
        t.request('GET', t.users.vars.base + '?show_wages=true')
          .then(function (resp) {
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
      return new Promise(function (resolve, reject) {
        t.request('GET', t.users.vars.base + '?show_wages=true')
          .then(function (response) {
            response.body.forEach(function (user) {
              console.log(user);
              if (user.phone == number) {
                return resolve({
                  id: user.id,
                  name: user.name,
                  phone_number: user.phone,
                  hourly: user.hourly_rate
                });
              }
            });
            resolve({err: "User with that number was not found."});
          })
          .catch(function (err) {
            reject(err);
          });
      });
    },
    getUserByName: function (name) {
      return new Promise(function (resolve, reject) {
        var returnUsers = [];
        t.users.get()
          .then(function (users) {
            users.forEach(function (user) {
              if (user.name.toLowerCase() == name.toLowerCase()) {
                returnUsers.push({
                  id: user.id,
                  name: user.name,
                  phone_number: user.phone,
                  hourly: user.hourly_rate
                });
              } else {
                var split = user.name.split(' ');
                for (var i = 0; i < split.length; i++) {
                  if (split[i].toLowerCase() == name.toLowerCase()) {
                    returnUsers.push({
                      id: user.id,
                      name: user.name,
                      phone_number: user.phone,
                      hourly: user.hourly_rate
                    });
                    break;
                  }
                }
              }
            });
            if (returnUsers.length == 1) {
              resolve(returnUsers[0]);
            } else {
              resolve(returnUsers);
            }
          })
      });
    }
  },

  departments: {},

  roles: {},

  award_tags: {},

  leave: {},

  unavailability: {},

  datastreams: {},

  store_stats: {},

  devices: {},

  clockins: {},

  sms: {}


};

module.exports = t;