'use strict'

const querySyntax = require('../helpers/querySyntax')

module.exports = function (query) {
  return new Promise((resolve, reject) => {
    let params = querySyntax(query)

    this.dispatch.get('/orders', params)
      .then((res) => resolve(res.data))
      .catch(reject)
  })
}
