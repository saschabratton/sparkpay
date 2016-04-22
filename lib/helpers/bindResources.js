'use strict'

const resources = require('../resources')

module.exports = (bindClass) => {
  for (var prop in resources) {
    if ({}.hasOwnProperty.call(resources, prop)) {
      bindClass[prop] = resources[prop]
    }
  }
}
