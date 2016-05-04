module.exports.show = function show(yes, first = true) {
    return yes ? (first ? '?' : '&') + 'show_costs=true' : '';
};
