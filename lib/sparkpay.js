'use strict';

const axios = require('axios');
const pkg = require('../package.json');

class SparkPay {

  constructor(conf) {
    if (!conf) {
      throw new Error("Missing SparkPay configuration! Must supply your store domain name and an API access token.");
    } else if (!conf.domain || !conf.token) {
      throw new Error("Missing SparkPay configuration! Must supply both a domain and token property.")
    }

    this.dispatch = axios.create({
      baseURL: 'https://' + conf.domain + '/api/v1',
      headers: {
        'X-AC-Auth-Token': conf.token,
        'User-Agent': 'sparkpay-node/' + pkg.version
      }
    });

    this.dispatch.interceptors.response.use(function(res) {
      console.log(res);
      return res;
    }, function(err) {
      console.log(err);
      throw err;
    });
  };


  orders(query) {
    if (query) {

    } else  {
      return this.dispatch.get('/orders');
    }
  };
}

module.exports = SparkPay;