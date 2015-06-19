'use strict'

module.exports = TransitionEvent

function TransitionEvent (from, to) {
  this.type = 'transition'
  this.from = from
  this.to = to
}

