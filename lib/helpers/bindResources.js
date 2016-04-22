'use strict'

const resources = require('../resources')
const querySyntax = require('./querySyntax')

module.exports = (bindProp, dispatch) => {
  resources.forEach((resourceName) => {
    bindProp[resourceName] = (query) => new Promise((resolve, reject) => {
      let config = {}

      config.params = querySyntax(query)

      if (query.noCache) {
        config.headers = { 'Cache-Control': 'no-cache' }
      }

      dispatch.get(resourceName, config)
        .then((res) => resolve(res.data))
        .catch(reject)
    })
  })
}
