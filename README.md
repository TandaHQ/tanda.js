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

### Setup Code (Probably in app.js)
```
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
```
// the route users go to login
app.get('/login', tanda.auth.request());

// your pre-defined callback url (set in the options before)
app.get('/authed', tanda.auth.receive(), function(req, res){
   res.send("You're authenticated! Your access token expires at " + req.client.expires + ".");
   // or whatever you want to happen.
   // the user object is now stored in req.client, but that will definitely change in future versions.
});
```

### Usage
After authentication, the methods line up almost exactly with what is on the
[Tanda Developer Docs](https://my.tanda.co/api/v2/documentation).

E.g, to get the current roster,
```
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

## Full Features
Coming soon...
It's mostly just the wrapper.  There are a couple of sugar functions to make life a bit easier, but these are completely
optional.  All the base method in the wrapper are available regardless.

## Complete Method List
Coming soon...

## Licence
Officially coming soon.

But licenced under MIT, so go for your life.