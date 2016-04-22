'use strict'

const resources = require('../resources')
const querySyntax = require('./querySyntax')

module.exports = (bindClass) => {
  resources.forEach((resource) => {
    bindClass[resource] = function (query) {
      return new Promise((resolve, reject) => {
        let params = querySyntax(query)

        this.dispatch.get('/' + resource, params)
          .then((res) => resolve(res.data))
          .catch(reject)
      })
    }
  })
}
