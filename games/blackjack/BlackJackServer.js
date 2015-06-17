'use strict'

var Hand = require('./Hand')
var Shoe = require('./Shoe')
var Player = require('./Player')
var Dealer = require('./Dealer')
var betting = require('./states/betting')
var dealing = require('./states/dealing')
var action = require('./states/action')
var scoring = require('./states/scoring')

module.exports = BlackJackServer

var stateDurations = {
  betting: 1000,
  dealing: 2000,
  action: 5000,
  scoring: 3000
}

var stateFunctions = {
  betting: betting,
  dealing: dealing,
  action: action,
  scoring: scoring,
}

function BlackJackServer (engine) {
  var activeState = 'betting'

  this.engine = engine
  this.states = ['betting', 'dealing', 'action', 'scoring'],
  this.state = {
    activeState: activeState,
    timer: stateDurations[activeState],
    shoe: new Shoe.Scrambled,
    dealer: new Dealer(new Hand.Empty),
    players: []
  }
}

function findNextCircular (array, val) {
  var index = array.indexOf(val)
  var nextIndex = array[index + 1] ? index + 1 : 0

  return array[nextIndex]
}

BlackJackServer.prototype.update = function (dT) {
  var bj = this
  var activeState = bj.state.activeState
  var activeFns = stateFunctions[activeState]
  var duration = stateDurations[activeState]
  var nextState = findNextCircular(bj.states, activeState)
  var nextFns = stateFunctions[nextState]

  if (bj.state.timer <= 0) {
    activeFns.onExit(bj)
    bj.state.activeState = nextState
    bj.state.timer = stateDurations[nextState]
    nextFns.onEnter(bj)
  } else {
    bj.state.timer = Math.max(bj.state.timer - dT, 0)
  }
}
