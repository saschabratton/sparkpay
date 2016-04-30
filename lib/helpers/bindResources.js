'use strict'

const resources = require('../resources')
const querySyntax = require('./querySyntax')

module.exports = (propToBind, dispatch) => {
  resources.forEach((resource) => {
    propToBind[resource.name] = (query) => new Promise((resolve, reject) => {
      let config = {}

      config.params = querySyntax(query)

      if (query.noCache) {
        config.headers = { 'Cache-Control': 'no-cache' }
      }

      dispatch.get(resource.name, config)
        .then((res) => resolve(res.data))
        .catch(reject)
    })
  })
}
