'use strict'

const joinParam = params => {
  if (Array.isArray(params)) {
    return params.join()
  } else if (typeof params === 'string') {
    return params
  }
  return null
}

const conjunctionOp = (queries, conjunction) => {
  if (!queries) return null

  if (!Array.isArray(queries) || (queries.length === 1)) {
    if (Array.isArray(queries)) queries = queries[0]

    if (queries.op && queries.value) {
      return conjunction + '+' + queries.op + ':' + queries.value
    }

    return conjunction + '+' + queries
  }

  queries.forEach((query, index) => {
    if (query.op && query.value) {
      queries[index] = query.op + ':' + query.value
    }
  })

  return queries.join('+' + conjunction + '+')
}

const formatQuery = query => {
  if (!query.op) {
    return query
  }

  switch (query.op.toLowerCase()) {
    case 'and':
      return conjunctionOp(query.value, 'AND')
    case 'or':
      return conjunctionOp(query.value, 'OR')
    case 'eq':
    case 'not':
    case 'like':
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
      return query.op + ':' + query.value
    default:
      return query.value
  }
}

const querySyntax = conf => {
  if (!conf) return null

  let params = {}

  if (conf.expand) {
    params.expand = joinParam(conf.expand)
  }

  if (conf.fields) {
    params.fields = joinParam(conf.fields)
  }

  if (conf.query && typeof conf.query === 'object') {
    for (let queryField in conf.query) {
      if ({}.hasOwnProperty.call(conf.query, queryField)) {
        params[queryField] = formatQuery(conf.query[queryField])
      }
    }
  }

  return params
}

const buildQuery = query => {
  if (!query || typeof query !== 'object') return null

  let config = { params: querySyntax(query) }

  if (query.noCache) {
    config.headers = { 'Cache-Control': 'no-cache' }
  }

  return config
}

module.exports = buildQuery
