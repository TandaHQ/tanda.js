var t = require('./index.js');

console.log('in cool');
console.log(t);
t.init({
  client_id : 'f2543e430edc386c52bdb876c69c80ee77ea1097e8fb838189467a94ef855f4f',
  client_secret : 'b2f57c439991fcfe26bb771949f8922aaa1bbd7ebb5c53c476909d2e5aa89467'});

t.rosters.current()
  .then(function(body){
    console.log('we made it!!!!!!');
    console.log(body);
  })
  .catch(function(err){
    console.log(err);
  });