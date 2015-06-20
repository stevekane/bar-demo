'use strict'

var State = require('../State')
var TransitionEvent = require('../events/TransitionEvent')

module.exports = BettingState

function BettingState (duration) {
  State.call(this)
  this.duration = duration
}

BettingState.prototype = Object.create(State.prototype)

function processEvent (blackJack, state, socket, event) {
  var player = blackJack.socketToPlayerMap.get(socket)

  switch (event.type) {
    case 'bet': 
      player.currentBet = event.amount
      player.chips -= event.amount 
      break
  }
}

BettingState.prototype.onEnter = function (blackJack) {
  for (var i = 0; i < blackJack.state.players.length; i++) {
    blackJack.state.players[i].currentBet = 0 
  }
  blackJack.state.timeLeft = this.duration
}

BettingState.prototype.update = function (dT, blackJack) {
  var activeStateName = blackJack.state.activeStateName
  var nextStateName = blackJack.states.nextKey(activeStateName)
  var sockets = blackJack.engine.clients.sockets
  var map = blackJack.socketToPlayerMap
  var socket
  var player

  for (var i = 0; i < sockets.length; i++) {
    socket = sockets[i]
    player = map.get(socket) 

    for (var j = 0; j < socket.events.length; j++) {
      processEvent(blackJack, this, socket, socket.events[j])
    }
  }

  blackJack.state.timeLeft -= dT
  if (blackJack.state.timeLeft <= 0) {
    blackJack.transitionTo(nextStateName)
  }
}
