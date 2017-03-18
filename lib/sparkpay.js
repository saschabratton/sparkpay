'use strict'

const TOO_MANY_REQUESTS = 429

const axios = require('axios')
const pkg = require('../package.json')

const bindResources = require('./helpers/bindResources')

class SparkPay {
  constructor (conf) {
    if (!conf) {
      throw new Error('Missing SparkPay configuration!')
    } else if (!conf.domain || !conf.token) {
      throw new Error('SparkPay configuration requires both domain and token.')
    }

    this.dispatch = axios.create({
      baseURL: 'https://' + conf.domain + '/api/v1',
      headers: {
        'X-AC-Auth-Token': conf.token,
        'User-Agent': 'sparkpay-node/' + pkg.version
      }
    })

    this.dispatch.interceptors.response.use(null, err => {
      if (err.status === TOO_MANY_REQUESTS) return this.retry(err)

      throw err
    })

    bindResources(this, this.dispatch)
  }

  retry (req) {
    return new Promise((resolve, reject) => {
      let retryTimeout = 0

      if (req.headers['retry-after']) {
        retryTimeout = new Date(req.headers['retry-after']) - Date.now()
      }

      setTimeout(() => {
        return resolve(this.dispatch.request(req.config))
      }, retryTimeout)
    })
  }

  static init (conf) {
    return new SparkPay(conf)
  }
}

module.exports = SparkPay
