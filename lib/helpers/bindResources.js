'use strict'

const resources = require('../resources')
const querySyntax = require('./querySyntax')

module.exports = (classToBind, dispatch) => {
  resources.forEach(resource => {
    classToBind[resource.name] = {}
    classToBind[resource.name].get = query => {
      let resourceURL = resource.name

      let config = null

      if (query) {
        config = { params: querySyntax(query) }

        if (query.noCache) {
          config.headers = { 'Cache-Control': 'no-cache' }
        }

        if (Number.isInteger(query) || query.id) {
          resourceURL += '/' + (query || query.id)
        }
      }

      return new Promise((resolve, reject) => {
        dispatch.get(resourceURL, config)
          .then(res => resolve(res.data))
          .catch(reject)
      })
    }
  })
}
