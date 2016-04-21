'use strict';

const axios = require('axios');
const pkg = require('../package.json');

const bindResources = require('./helpers/bindResources');

class SparkPay {

  constructor(conf) {
    if (!conf) {
      throw new Error("Missing SparkPay configuration! Must supply your store domain name and an API access token.");
    } else if (!conf.domain || !conf.token) {
      throw new Error("Missing SparkPay configuration! Must supply both a domain and token property.");
    }

    this.dispatch = axios.create({
      baseURL: 'https://' + conf.domain + '/api/v1',
      headers: {
        'Accept': 'application/json',
        'X-AC-Auth-Token': conf.token,
        'User-Agent': 'sparkpay-node/' + pkg.version
      }
    });

    this.retry = this.retry.bind(this);

    this.dispatch.interceptors.response.use(undefined, (err) => {
      if (err.status === 429) {
        return this.retry(err);
      }
      return err;
    });

    bindResources(this);
  }

  retry(err) {
    return new Promise((resolve, reject) => {
      let retryTimeout = new Date(err.headers['retry-after']) - Date.now();
      setTimeout(() => {
        this.dispatch.request(err.config).then(resolve).catch(reject);
      }, retryTimeout);
    });
  }

}

module.exports = {
  config: (conf) => { return new SparkPay(conf); }
};