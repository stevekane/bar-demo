'use strict'

var State = require('../State')
var TransitionEvent = require('../events/TransitionEvent')

/*
 * Only state where list of active players may change.
 * Reset list of active players
 * Respond to bet events from players by changing their currentBet
 * Ignore duplicate bet events for a single player
 * This state always runs its full duration before transitioning
 * 
 */

module.exports = BettingState

function BettingState (duration, minBet) {
  State.call(this)
  this.duration = duration
  this.minBet = minBet
}

BettingState.prototype = Object.create(State.prototype)

function processBet (blackJack, state, socket) {
  var player = blackJack.socketToPlayerMap.get(socket)
  var alreadyActive = blackJack.state.activePlayers.indexOf(player) !== -1

  if (alreadyActive) return

  blackJack.state.activePlayers.push(player)
  player.currentBet = state.minBet
  player.chips = Math.max(player.chips - state.minBet, 0)
}

BettingState.prototype.onEnter = function (blackJack) {
  for (var i = 0; i < blackJack.state.players.length; i++) {
    blackJack.state.players[i].currentBet = 0 
  }
  blackJack.state.timeLeft = this.duration
}

BettingState.prototype.update = function (dT, blackJack) {
  var activeStateName = blackJack.state.activeStateName
  var nextStateName = blackJack.states.nextKey(this.name)
  var sockets = blackJack.engine.clients.sockets
  var map = blackJack.socketToPlayerMap
  var socket
  var event

  for (var i = 0; i < sockets.length; i++) {
    socket = sockets[i]

    for (var j = 0; j < socket.events.length; j++) {
      event = socket.events[j]

      if (event.type === 'bet') processBet(blackJack, state, socket)
    }
  }

  blackJack.state.timeLeft -= dT
  if (blackJack.state.timeLeft <= 0) {
    blackJack.transitionTo(nextStateName)
  }
}
