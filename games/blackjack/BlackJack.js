'use strict'

var CircularOrderedDict = require('./CircularOrderedDict')
var BettingState = require('./states/BettingState')
var DealingState = require('./states/DealingState')
var State = require('./State')
var Dealer = require('./Dealer')
var Player = require('./Player')
var fns = require('../utils/functions')
var remove = fns.remove

var MAX_WAIT = Number.MAX_SAFE_INTEGER

module.exports = BlackJack

function BlackJack (engine) {
  var players = []
  var activePlayers = []
  var socketToPlayerMap = new WeakMap
  var playerToSocketMap = new WeakMap

  engine.clients.on('connection', function registerClient (socket) {
    var player = new Player

    function handleDisconnect () { remove(players, player) }
    function handleBet () { socket.events.push({type: 'bet'}) }
    function handleHit () { socket.events.push({type: 'hit'}) }
    function handleStand () { socket.events.push({type: 'stand'}) }

    socket.events = []
    socketToPlayerMap.set(socket, player)
    playerToSocketMap.set(player, socket)
    players.push(player)

    socket.on('disconnect', handleDisconnect)
    socket.on('bet', handleBet)
    socket.on('hit', handleHit)
    socket.on('stand', handleStand)
  })

  this.engine = engine
  this.socketToPlayerMap = socketToPlayerMap
  this.playerToSocketMap = playerToSocketMap
  this.states = new CircularOrderedDict
  this.states.append('betting', new BettingState(6000))
  this.states.append('dealing', new DealingState(2000))
  this.state = {
    activeStateName: this.states.firstKey(),
    timeLeft: this.states.first().duration,
    dealer: new Dealer,
    players: players,
    activePlayers: activePlayers 
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

  //loop over all sockets checking if they exist in the map already
  //if they do, make sure that player is in the playerlist

  for (var i = 0; i < clients.sockets.length; i++) {
    socket = clients.sockets[i]
    player = map.get(socket) || new Player

    map.set(socket, player)
    players.push(this.socketToPlayerMap.get(socket))
    if (player.currentBet > 0) activePlayers.push(player)
  }

  activeState.update(dT, this)
}
