const resources = require('../resources');

module.exports = (bindClass) => {
  for(var prop in resources) {
    bindClass[prop] = resources[prop];
  }
};