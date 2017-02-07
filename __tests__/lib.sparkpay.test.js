'use strict'

const testConfig = {
  domain: 'www.example.com',
  token: 'foo'
}
const sparkpay = require('../lib/sparkpay').init(testConfig)
const resources = require('../lib/resources')

describe('instance of sparkpay module', () => {
  it('has dispatch method', () => {
    expect(typeof sparkpay.dispatch).toBe('function')
  })

  it('has an object for each resource', () => {
    resources.forEach(resource => {
      expect(typeof sparkpay[resource.name]).toBe('object')
    })
  })
})

const pkg = require('../package.json')

describe('sparkpay module dispatch', () => {
  it('has configured base url', () => {
    expect(sparkpay.dispatch.defaults.baseURL)
      .toBe('https://' + testConfig.domain + '/api/v1')
  })

  it('sends configured auth token', () => {
    expect(sparkpay.dispatch.defaults.headers['X-AC-Auth-Token'])
      .toBe(testConfig.token)
  })

  it('sends user agent with module version', () => {
    expect(sparkpay.dispatch.defaults.headers['User-Agent'])
      .toBe('sparkpay-node/' + pkg.version)
  })

  it('has no request interceptor', () => {
    expect(sparkpay.dispatch.interceptors.request.handlers.length).toBe(0)
  })

  it('has one response interceptor', () => {
    expect(sparkpay.dispatch.interceptors.response.handlers.length).toBe(1)
  })
})

const responseInterceptor = sparkpay.dispatch.interceptors.response.handlers[0]

describe('sparkpay module dispatch response interceptor', () => {
  it('only handles rejected requests', () => {
    expect(responseInterceptor.fulfilled).toBeNull()
    expect(responseInterceptor.rejected).not.toBeNull()
  })

  it('checks for status code of error', () => {
    expect(() => responseInterceptor.rejected())
      .toThrowError('Cannot read property \'status\' of undefined')
    expect(() => responseInterceptor.rejected()).toThrowError(TypeError)
  })
})
