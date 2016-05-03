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

  queries.forEach((query, index) => {
    queries[index] = query.op + ':' + query.value
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
  let params = {}

  if (conf.expand) {
    params.expand = joinParam(conf.expand)
  }

  if (conf.fields) {
    params.fields = joinParam(conf.fields)
  }

  if (conf.query) {
    for (let prop in conf.query) {
      if ({}.hasOwnProperty.call(conf.query, prop)) {
        params[prop] = formatQuery(conf.query[prop])
      }
    }
  }

  return params
}
