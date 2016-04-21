const resources = require('../resources');

module.exports = function(bindClass) {
  for(var prop in resources) {
    bindClass[prop] = resources[prop];
  }
};