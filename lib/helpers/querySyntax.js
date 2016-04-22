'use strict'

const conjunctionOp = (queries, conjunction) => {
  if (!Array.isArray(queries)) {
    return null
  }

  queries.forEach((query, index, queryArray) => {
    queryArray[index] = query.op + ':' + query.value
  })
  return queries.join(conjunction)
}

const formatQuery = (query) => {
  if (!query.op) {
    return query
  }

  switch (query.op.toLowerCase()) {
    case 'and':
      return conjunctionOp(query.value, '+AND+')
    case 'or':
      return conjunctionOp(query.value, '+OR+')
    default:
      return query.op + ':' + query.value
  }
}

module.exports = (conf) => {
  if (!conf) {
    return null
  }

  let request = { params: {} }

  if (conf.id) {
    request.params.id = conf.id
  }

  if (conf.fields) {
    if (Array.isArray(conf.fields)) {
      request.params.fields = conf.fields.join()
    } else if (typeof conf.fields === 'string') {
      request.params.fields = conf.fields
    }
  }

  if (conf.query) {
    for (var prop in conf.query) {
      if ({}.hasOwnProperty.call(conf.query, prop)) {
        request.params[prop] = formatQuery(conf.query[prop])
      }
    }
  }

  if (conf.noCache) {
    request.headers = { 'Cache-Control': 'no-cache' }
  }

  return request
}
