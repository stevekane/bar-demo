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
    players: []
  }
}

function doTransition (game, from, to) {
  game.states.get(from).onExit(game)
  game.state.activeStateName = to
  game.states.get(to).onEnter(game)
}

function processEvent (game, event) {
  switch (event.type) {
    case 'transition': return doTransition(game, event.from, event.to)
    case 'create': return doAdd(game, event.type, event.entity)
    case 'remove': return doRemove(game, event.type, event.entity)
  } 
}

BlackJack.prototype.update = function (dT) {
  var events = this.engine.events
  var activeState = this.states.get(this.state.activeStateName)
  var clients = this.engine.clients
  var players = this.state.players
  var map = this.socketToPlayerMap
  var socket
  var player

  players.splice(0)

  for (var i = 0; i < clients.sockets.length; i++) {
    socket = clients.sockets[i]
    player = map.get(socket) || new Player

    map.set(socket, player)
    players.push(this.socketToPlayerMap.get(socket))
  }
  activeState.update(dT, this)

  for (var i = 0; i < events.length; i++) {
    processEvent(this, events[i]) 
  }
  //broadcast to clients
}
