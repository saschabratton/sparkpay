'use strict'

const joinParam = (values) => {
  if (Array.isArray(values)) {
    return values.join()
  } else if (typeof values === 'string') {
    return values
  }
}

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

  if (conf.expand) {
    request.params.expand = joinParam(conf.expand)
  }

  if (conf.fields) {
    request.params.fields = joinParam(conf.fields)
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
