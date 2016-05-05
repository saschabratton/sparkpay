'use strict'

const resources = require('../resources')
const querySyntax = require('./querySyntax')

module.exports = (propToBind, dispatch) => {
  resources.forEach(resource => {
    propToBind[resource.name] = query =>
      new Promise((resolve, reject) => {
        let config = { params: querySyntax(query) }

        if (query.noCache) {
          config.headers = { 'Cache-Control': 'no-cache' }
        }

        let resourceURL = resource.name
        if (query.id) {
          resourceURL += '/' + query.id
        }

        dispatch.get(resourceURL, config)
          .then(res => resolve(res.data))
          .catch(reject)
      })
  })
}
