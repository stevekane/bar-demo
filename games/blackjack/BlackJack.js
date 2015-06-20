'use strict'

var CircularOrderedDict = require('./CircularOrderedDict')
var BettingState = require('./states/BettingState')
var DealingState = require('./states/DealingState')
var State = require('./State')
var Dealer = require('./Dealer')
var Player = require('./Player')

var MAX_WAIT = Number.MAX_SAFE_INTEGER

module.exports = BlackJack

function BlackJack (engine) {
  this.socketToPlayerMap = new WeakMap
  this.engine = engine
  this.states = new CircularOrderedDict
  this.states.append('betting', new BettingState(6000))
  this.states.append('dealing', new DealingState(2000))
  //this.states.append('scoring', new State(5000))

  this.state = {
    activeStateName: this.states.firstKey(),
    timeLeft: this.states.first().duration,
    dealer: new Dealer,
    players: [],
    activePlayers: []
  }
}

BlackJack.prototype.transitionTo = function (to) { 
  var from = this.state.activeStateName

  this.states.get(from).onExit(this)
  this.state.activeStateName = to
  this.states.get(to).onEnter(this)
}

BlackJack.prototype.update = function (dT) {
  var activeState = this.states.get(this.state.activeStateName)
  var clients = this.engine.clients
  var players = this.state.players
  var activePlayers = this.state.activePlayers
  var map = this.socketToPlayerMap
  var socket
  var player

  activePlayers.splice(0)
  players.splice(0)

  for (var i = 0; i < clients.sockets.length; i++) {
    socket = clients.sockets[i]
    player = map.get(socket) || new Player

    map.set(socket, player)
    players.push(this.socketToPlayerMap.get(socket))
    if (player.currentBet > 0) activePlayers.push(player)
  }

  activeState.update(dT, this)
}
