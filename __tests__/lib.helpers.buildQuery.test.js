'use strict'

const buildQuery = require('../lib/helpers/buildQuery')

describe('query builder', () => {
  it('returns null if no query object', () => {
    expect(buildQuery()).toBeNull()
  })

  it('will return unmodified query param if it has no op key', () => {
    expect(buildQuery({ query: { foo: 'bar' } }).params)
      .toEqual({ foo: 'bar' })
  })

  it('will join only expand or fields params if arrays', () => {
    expect(buildQuery({ fields: ['foo', 'bar'] }).params.fields)
      .toBe('foo,bar')
    expect(buildQuery({ expand: ['foo', 'bar'] }).params.expand)
      .toBe('foo,bar')
    expect(buildQuery({ query: ['foo', 'bar'] }).params.query)
      .not.toBe('foo,bar')
    expect(buildQuery({ someParam: ['foo', 'bar'] }).params.someParam)
      .not.toBe('foo,bar')
  })

  it('allows adding no-cache header to config', () => {
    expect(buildQuery({ noCache: true }).headers['Cache-Control'])
      .toBe('no-cache')
  })
})
