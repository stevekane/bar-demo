'use strict'

var State = require('../State')
var TransitionEvent = require('../events/TransitionEvent')

module.exports = BettingState

function BettingState (duration) {
  State.call(this)
  this.duration = duration
}

BettingState.prototype = Object.create(State.prototype)

BettingState.prototype.onEnter = function (blackJack) {
  console.log('entered betting')  
  blackJack.state.timeLeft = this.duration
}

BettingState.prototype.update = function (dT, blackJack) {
  var activeStateName = blackJack.state.activeStateName
  var nextStateName = blackJack.states.nextKey(activeStateName)

  blackJack.state.timeLeft -= dT
  if (blackJack.state.timeLeft <= 0) {
    blackJack.engine.events.push(new TransitionEvent(activeStateName, nextStateName))
  }
}
