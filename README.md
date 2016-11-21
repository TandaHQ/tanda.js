# tanda.js
> Tanda for your JavaScript

Caution: This library is complete (probably), but has not been tested.  If you come across any 
problems open an issue, or be a champ and bust out a pull request.

## About
`node-tanda` is now an isomorphic library, which can be used both in the browser or with node.js.
  There are some differences with authentication, but there are (will be) handlers available for 
  a couple of the standard ways to authenticate with the standard server architectures.

## How to use

`yarn add tanda`, or `npm install --save tanda`.

There are a couple of chainable options which don't line up exactly with what the API spec shows.
  To enable `show_costs` on a call to the API, you should prepend `.showCosts` to the front on 
  your call.  E.g. `tanda.rosters.showCosts.get(1);`.
  
The chainable options available are:

- `show_costs` => `.showCosts`
- `show_award_interpretation` => `.showAwardInterpretation`
- `include_names` => `.includeNames`

If the option is available in the API docs, it'll be available.  If your IDE is worth it's 
weight, it should show it as an option for you.

### Super Simple Startup

```js
import Tanda from 'tanda';

const tanda = new Tanda({ authToken: '12345' });

tanda.rosters.get(1).then(rosters => console.log(rosters));
tanda.timesheets.showAwardInterpretation.current().then(timesheet => console.log(timesheet));

// etc, etc
```

### Isomorphism

This library runs in both the client and the server.  If you're using Webpack or Babel, you can 
really do whatever.  If you're using older-school Node.js, a standard `var Tanda = require
('tanda')` should be fine.  For the browser, there is a pre-made package you can use.  If you 
download the `browser` script, from `./out`, it will expose `window.Tanda` which you can use.

MIT Licence
