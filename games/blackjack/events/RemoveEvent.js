'use strict'

module.exports = RemoveEvent

function RemoveEvent (entity) {
  this.type = 'remove'
  this.entity = entity
}
