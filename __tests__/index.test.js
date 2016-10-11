'use strict'

const SparkPay = require('../index')
const testConfig = {
  domain: 'www.example.com',
  token: 'foo'
}

describe('sparkpay module', () => {
  it('is instantiable', () => {
    expect(new SparkPay(testConfig)).toBeInstanceOf(SparkPay)
  })

  it('requires configuration object', () => {
    expect(() => new SparkPay()).toThrowError('Missing SparkPay configuration!')
  })

  it('requires both domain and token in configuration object', () => {
    expect(() => new SparkPay({
      domain: 'www.example.com'
    })).toThrowError('SparkPay configuration requires both domain and token.')
    expect(() => new SparkPay({
      token: 'foo'
    })).toThrowError('SparkPay configuration requires both domain and token.')
  })

  it('has static init method that returns an instance of itself', () => {
    expect(SparkPay.init(testConfig)).toBeInstanceOf(SparkPay)
  })

  it('has retry method in prototype', () => {
    expect(SparkPay.retry).not.toBeDefined()
    expect(typeof SparkPay.prototype.retry).toBe('function')
  })

  it('does not have dispatch method when uninstantiated', () => {
    expect(SparkPay.dispatch).not.toBeDefined()
    expect(SparkPay.prototype.dispatch).not.toBeDefined()
  })
})
