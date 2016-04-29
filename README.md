# node-tanda

## About
A wrapper for Tanda's v2 API, designed for use in express-based web applications.

Heavily influenced/designed for use with express.js, but other than authentication, you can use the wrapper anywhere.
However, OAuth cannot be used for solely server-side apps (i.e. no client interaction), because even with your API keys,
the authenticating server needs to redirect to a page to finish the auth process.  So you'll struggle to use it outside
of express without some kind of OAuth2.0 hack solution.

This wrapper heavily features/relies on/promotes the use of promises.  These are standard Bluebird promises, and are
great for daisy-chaining.

## How to use

`npm i -S tanda`, or `npm install --save tanda`.

### Setup Code (Probably in app.js)
```javascript
var tanda = require('tanda');
tanda.init(MY_API_KEY, MY_API_SECRECT);

var auth_options = {
  redirect : url to redirect OAuth requests to (must be preset at https://my.tanda.co),
  scope : a string containing a single scope to request permission for,
  scopes : an array of string containing scopes to request (only one of [scope, scopes] is allowed)
}

tanda.auth.init(auth_options);
```

### Authenticating
```javascript
// the route users go to login
app.get('/login', tanda.auth.request;

// your pre-defined callback url (set in the options before)
app.get('/authed', tanda.auth.receive, function(req, res){
   res.send("You're authenticated! Your access token expires at " + req.client.expires + ".");
   // or whatever you want to happen.
   // the user object is now stored in req.client, but that will definitely change in future versions.
});
```

### Usage
After authentication, the methods line up almost exactly with what is on the
[Tanda Developer Docs](https://my.tanda.co/api/v2/documentation).

E.g, to get the current roster,
```javascript
tanda.rosters.current(true) // show cost
  .then(function(roster){
    console.log(roster); // a JSON object containing the current roster.
  })
  .catch(function(err){
    console.log(err.err);  // Errors are always an object, with the key as 'err'.
  });
```

If the method has a show costs option (a lot of them do, but you'll need the 'costs' scope), you can request the costs
 by passing in a boolean flag as the last parameter to a request.  If the method needs an ID, or a date, or both, they
 must be passed through before show cost.

To create a schedule, pass in the schedule object, as seen in the API docs,
```
tanda.schedules.create(new_schedule)
  .then(function(schedule){
    console.log(schedule); // contains the recently created schedule as returned by the server
  })
  .catch(function(err){
    console.log(err.err);
  });
```

To generalise, all methods are available at `tanda.<endpoint>.method`.  The name of the method is generally the
operation type, or if multiple (eg. get current, get containing), the name will be whatever comes after the endpoint in
the request URI.  All methods are (will be) under 'Complete Method List', for reference.

All API methods (not authentication) return a promise.  The return values listed in the Complete Method List are what
the promise is resolved with.  Remember to always `catch()` or `.then(success, fail)` to handle an error.

Additionally, all schemas for objects returned are available in the API docs

## Full Features
Coming soon...
It's mostly just the wrapper.  There are a couple of sugar functions to make life a bit easier, but these are completely
optional.  All the base method in the wrapper are available regardless.

## Complete Method List
### Authentication
* `tanda.auth.init(client_id, client_secret)`
    * initialises the authentication wrapper with the required values
    * parameters
        * client_id - your client ID, as gotten from the Tanda developer dash
        * client_secret - your client secret key, as gotten from the Tanda developer dash
    * returns - nothing
* `tanda.auth.request`
    * standard express middleware
    * redirects users to Tanda to authenticate
* `tanda.auth.receive`
    * standard express middleware
    * receives the access_tokens back from Tanda.

### Rosters
* `tanda.rosters.get(id, show_costs)`
    * Endpoint: [/api/v2/rosters/{id}{?show_costs}](https://my.tanda.co/api/v2/documentation#rosters-roster-get)
    * Get a roster based on a roster ID
    * Parameters
        * `id` (required) - the ID of the roster you want to find - (string/int)
        * `show_costs` (optional) - receive costs back with roster - (bool)
    * Returns - roster (object)
* `tanda.rosters.current(show_costs)`
    * Endpoint : [/api/v2/rosters/current{?show_costs}](https://my.tanda.co/api/v2/documentation#rosters-current-roster-get)
    * Get the current roster (for the week)
    * Parameters
        * `show_costs` (optional) - receive costs back with the roster - (bool)
    * Returns - roster (object)
* `tanda.rosters.contains(date, show_costs)`
    * Endpoint : [/api/v2/rosters/on/{date}{?show_costs}](https://my.tanda.co/api/v2/documentation#rosters-roster-that-contains-date-get)
    * Get the roster for the week containing `date`
    * Parameters
        * `date` (required) - ISO Formatted Date (YYYY-MM-DD) - (string)
        * `show_costs` (optional) - receive costs back with the roster - (bool)
    * Returns - roster (object)
* `tanda.rosters.on_date(date, show_costs)`
    * Sugar
    * Get the roster for a particular day
    * Parameters
        * `date` (required) - ISO Formatted Date (YYYY-MM-DD) - (string)
        * `show_costs` (optional) - receive costs back with the roster - (bool)
    * Returns - schedules (array) for the date passed in

### Schedules
* `tanda.schedules.gets(ids, shows_costs)`
    * Endpoint : [/api/v2/schedules{?ids,show_costs}](https://my.tanda.co/api/v2/documentation#schedules-schedule-list)
    * Get the schedules identified by the provided IDs
    * Parameters
        * `ids` (required) - Array of ids to look for - (array)
        * `show_costs` (optional) - receive costs back with the roster - (bool)
    * Returns - schedules (array) for the valid IDs
* `tanda.schedules.create(schedule)`
    * Endpoint : [/api/v2/schedules](https://my.tanda.co/api/v2/documentation#schedules-schedule-list-post)
    * Create a schedule
    * Parameters
        * `schedule` (required) - The schedule object to create - (object)
    * Returns - The schedule object, as returned by the server (ID, Roster ID, etc added)
* `tanda.schedules.get(id, shows_costs)`
    * Endpoint : [/api/v2/schedules/{id}{?show_costs}](https://my.tanda.co/api/v2/documentation#schedules-schedule-get)
    * Get the schedule identified by the provided ID.
    * Parameters
        * `id` (required) - ID to look for - (string/int)
        * `show_costs` (optional) - receive costs back with the roster - (bool)
    * Returns - schedules (array) for the valid IDs
* `tanda.schedules.update(id, update)`
    * Endpoint : [/api/v2/schedules/{id}](https://my.tanda.co/api/v2/documentation#schedules-schedule-put)
    * Update the information for the schedule identified by `id` with the information in `update`
    * Parameters
        * `id` (required) - ID to update - (string/int)
        * `update` (required) - Information to change/add the the schedule - (object)
    * Returns - The new schedule, complete, from the server - (object)
* `tanda.schedules.delete(id)`
    * Endpoint : [/api/v2/schedules/{id}](https://my.tanda.co/api/v2/documentation#schedules-schedule-put)
    * Delete the schedule identified by `id`
    * Parameters
        * `id` (required) - ID to delete - (string/int)
    * Returns - nil

## Licence
Officially coming soon.

But licenced under MIT, so go for your life.