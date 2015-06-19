'use strict'

var CircularOrderedDict = require('./CircularOrderedDict')
var State = require('./State')
var BettingState = require('./states/BettingState')
var Dealer = require('./Dealer')

var MAX_WAIT = Number.MAX_SAFE_INTEGER

module.exports = BlackJack

function BlackJack (engine) {
  this.engine = engine
  this.states = new CircularOrderedDict
  //this.states.append('waiting', new State(MAX_WAIT))
  this.states.append('betting', new BettingState(6000))
  //this.states.append('dealing', new State(2000))
  //this.states.append('action', new State(15000))
  //this.states.append('scoring', new State(5000))

  this.state = {
    activeStateName: this.states.firstKey(),
    timeLeft: this.states.first().duration,
    dealer: null,
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

  activeState.update(dT, this)

  for (var i = 0; i < events.length; i++) {
    processEvent(this, events[i]) 
  }
  //broadcast to clients
}
