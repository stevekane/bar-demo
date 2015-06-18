'use strict'

var clone = require('node-clone')
var CircularOrderedDict = require('./CircularOrderedDict')
var State = require('./State')
var Dealer = require('./Dealer')
var events = require('./events')
var TransitionEvent = events.TransitionEvent

var MAX_WAIT = Number.MAX_SAFE_INTEGER

module.exports = BlackJack

function BlackJack () {
  this.states = new CircularOrderedDict
  this.states.append('waiting', new State(MAX_WAIT))
  this.states.append('betting', new State(6000))
  this.states.append('dealing', new State(2000))
  this.states.append('action', new State(15000))
  this.states.append('scoring', new State(5000))

  this.state = {
    activeState: this.states.firstKey(),
    timeLeft: this.states.first().duration,
    dealer: null,
    players: [],
    events: [] 
  }
}

//:: Game -> String -> String -> Game (in some sense return value is new Game)
function doTransition (game, from, to) {
  game.states.get(from).onExit(game)
  game.state.activeState = to
  game.state.timeLeft = game.states.get(to).duration
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
  var activeState = this.state.activeState
  var nextState = this.states.nextKey(activeState)
  var events = this.state.events

  this.state.timeLeft -= dT
  if (this.state.timeLeft <= 0) events.push(new TransitionEvent(activeState, nextState))
  //run current state update

  for (var i = 0; i < events.length; i++) {
    processEvent(this, events[i]) 
  }
  //broadcast to clients
  console.log(this.state.timeLeft, this.state.activeState)
  events.splice(0)
}
