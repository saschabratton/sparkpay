'use strict'

const querySyntax = require('./querySyntax')

module.exports = (resources, classToBind, dispatch) => {
  resources.forEach(resource => {
    classToBind[resource.name] = {
      get: query => {
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

        return dispatch.get(resourceURL, config).then(res => res.data)
      }
    }
  })
}
