'use strict'

module.exports.TransitionEvent = TransitionEvent
module.exports.CreateEvent = CreateEvent
module.exports.RemoveEvent = RemoveEvent

function TransitionEvent (from, to) {
  this.type = 'transition'
  this.from = from
  this.to = to
}

function CreateEvent (entity) {
  this.type = 'create'
  this.entity = entity
}

function RemoveEvent (entity) {
  this.type = 'remove'
  this.entity = entity
}
