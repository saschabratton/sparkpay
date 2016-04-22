'use strict'

const resources = require('../resources')
const querySyntax = require('./querySyntax')

module.exports = (bindProp, dispatch) => {
  resources.forEach((resourceName) => {
    bindProp[resourceName] = (query) => new Promise((resolve, reject) => {
      let params = querySyntax(query)

      dispatch.get(resourceName, params)
        .then((res) => resolve(res.data))
        .catch(reject)
    })
  })
}
