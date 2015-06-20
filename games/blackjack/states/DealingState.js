'use strict'

var State = require('../State')
var Hand = require('../Hand')
var Card = require('../Card')
var TransitionEvent = require('../events/TransitionEvent')

module.exports = DealingState

function DealingState (duration) {
  State.call(this)
  this.duration = duration
}

DealingState.prototype = Object.create(State.prototype)

DealingState.prototype.onEnter = function (blackJack) {
  var activePlayers = blackJack.state.activePlayers
  var player 

  for (var i = 0; i < activePlayers.length; i++) {
    player = activePlayers[i]

    player.hands.splice(0)
    player.hands.push(new Hand([new Card.Random(), new Card.Random()]))
  }
  blackJack.state.dealer.hand = new Hand([new Card.Random(), new Card.Random()])
  blackJack.state.timeLeft = this.duration
}

DealingState.prototype.update = function (dT, blackJack) {
  var activeStateName = blackJack.state.activeStateName
  var nextStateName = blackJack.states.nextKey(activeStateName)

  blackJack.state.timeLeft -= dT
  if (blackJack.state.timeLeft <= 0) {
    blackJack.transitionTo(nextStateName)
  }
}
