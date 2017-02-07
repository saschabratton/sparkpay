'use strict'

const buildQuery = require('./buildQuery')

module.exports = (resources, classToBind, dispatch) => {
  resources.forEach(resource => {
    classToBind[resource.name] = {
      get: function (query) {
        let resourceURL = resource.name
        let resourceKey = resource.collect || resource.name

        if (!query) return dispatch.get(resourceURL).then(res => res.data)

        let config = buildQuery(query)

        if (Number.isInteger(Number(query)) || query.id) {
          resourceURL += '/' + (query.id || query)
        }

        if (query.collect) {
          let collection = []

          return dispatch.get(resourceURL, config).then(function nextPage (res) {
            collection = collection.concat(res.data[resourceKey])

            if (!res.data.next_page) return collection

            return dispatch.get(res.data.next_page).then(nextPage)
          })
        }

        return dispatch.get(resourceURL, config).then(res => res.data)
      },

      collect: function (query) {
        if (!query) query = {}
        if (typeof query === 'object') query.collect = true

        return this.get(query)
      }
    }
  })
}
