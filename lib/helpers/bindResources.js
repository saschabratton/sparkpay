'use strict'

const buildQuery = require('./buildQuery')
const collector = require('./collector')

module.exports = (resources, classToBind, dispatch) => {
  resources.forEach(resource => {
    let resourceURL = resource.name

    classToBind[resource.name] = {
      get: function (query) {
        let config = buildQuery(query)

        if (query && (Number.isInteger(query) || query.id)) {
          resourceURL += '/' + (query || query.id)
        }

        return dispatch.get(resourceURL, config).then(res => res.data)
      },
      collect: function (query) {
        return this.get(query).then(res => {
          if (res.next_page) {
            return collector(dispatch, res.next_page, res[resource.collect || resource.name])
          }
          return res[resource.collect || resource.name]
        })
      }
    }
  })
}
