'use strict'

const collector = (dispatch, requestURL, collection) =>
  new Promise((resolve, reject) => {
    dispatch.get(requestURL).then(res => {
      collection = collection.concat(res.data.orders)

      if (res.data.next_page) {
        resolve(collector(dispatch, res.data.next_page, collection))
      } else {
        resolve(collection)
      }
    }).catch(reject)
  })

module.exports = collector
