var renderConsole = require('./render-console').render
var fns = require('../utils/functions')
var StateManager = require('./StateManager')
var states = require('./states')
var BetCollecting = states.BetCollecting
var CardDealing = states.CardDealing
var Action = states.Action
var PostRound = states.PostRound
var CardCollecting = states.CardCollecting
var Clock = require('./Clock')
var Hand = require('./Hand')
var Shoe = require('./Shoe')
var Player = require('./Player')
var Dealer = require('./Dealer')

var UPDATE_RATE = 100
var RENDER_RATE = 100

module.exports = BlackJack

function BlackJack () {
  this.stateManager = new StateManager([
    new BetCollecting(this),
    new CardDealing(this),
    new Action(this),
    new PostRound(this),
    new CardCollecting(this)
  ])
  this.shoe = new Shoe.Scrambled
  this.dealer = new Dealer(new Hand.Empty)
  this.clock = new Clock
  this.players = []
}

var blackJack = new BlackJack

blackJack.players.push(new Player('Steve'))
blackJack.players.push(new Player('Lynn'))

function update () {
  blackJack.clock.tick()
  blackJack.stateManager.activeState.update(blackJack.clock.dT)
}

function render () {
  blackJack.stateManager.activeState.render()
  console.log('\033c', renderConsole(blackJack))
}

setInterval(update, UPDATE_RATE)
setInterval(render, RENDER_RATE)
