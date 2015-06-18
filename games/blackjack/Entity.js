'use strict'

var uuid = require('node-uuid')

module.exports = Entity

function Entity () {
  this.uuid = uuid.v4()
}
