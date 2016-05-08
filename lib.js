module.exports.show = function show(yes, first = true) {
  return yes ? (first ? '?' : '&') + 'show_costs=true' : '';
};

module.exports.show_wages = function(yes, first = true) {
  return yes ? (first ? '?' : '&') + 'show_wages=true' : '';
};
