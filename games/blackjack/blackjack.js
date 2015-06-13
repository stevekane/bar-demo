'use strict'

var fns = require('../utils/functions')
var StateManager = require('./StateManager')
var states = require('./states')
var BetCollecting = states.BetCollecting
var CardDealing = states.CardDealing
var Action = states.Action
var PostRound = states.PostRound
var CardCollecting = states.CardCollecting
var Hand = require('./Hand')
var Shoe = require('./Shoe')
var Player = require('./Player')
var Dealer = require('./Dealer')

var UPDATE_RATE = 100
var RENDER_RATE = 100

module.exports = BlackJack

function BlackJack (engine) {
  this.engine = engine
  this.stateManager = new StateManager([
    new BetCollecting(engine, this),
    new CardDealing(engine, this),
    new Action(engine, this),
    new PostRound(engine, this),
    new CardCollecting(engine, this)
  ])
  this.shoe = new Shoe.Scrambled
  this.dealer = new Dealer(new Hand.Empty)
  this.players = []
}

BlackJack.prototype.render = function () {
  this.stateManager.activeState.render()
}

BlackJack.prototype.update = function () {
  this.stateManager.activeState.update(this.engine.clock.dT)
}
