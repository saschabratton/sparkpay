'use strict'

const resources = require('../lib/resources')

resources.forEach(resource => {
  describe(resource.name + ' resource', () => {
    it('has a name', () => {
      expect(resource.name).toBeDefined()
    })
  })
})
