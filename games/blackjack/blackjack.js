var renderConsole = require('./render-console').render
var fns = require('../utils/functions')
var transactions = require('./transactions')
var dealRound = transactions.dealRound
var hit = transactions.hit
var StateManager = require('./StateManager')
var states = require('./states')
var BetCollecting = states.BetCollecting
var CardDealing = states.CardDealing
var Action = states.Action
var PostRound = states.PostRound
var Clock = require('./Clock')
var Hand = require('./Hand')
var Shoe = require('./Shoe')
var Player = require('./Player')
var Dealer = require('./Dealer')

var UPDATE_RATE = 100
var RENDER_RATE = 1000

module.exports = BlackJack

function BlackJack () {
  this.stateManager = new StateManager([
    new BetCollecting(this),
    new CardDealing(this),
    new Action(this),
    new PostRound(this)
  ])
  this.shoe = new Shoe.Scrambled
  this.dealer = new Dealer(new Hand.Empty)
  this.players = []
  this.clock = new Clock
}

var blackJack = new BlackJack

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

//blackJack.players.push(new Player('Steve'))
//blackJack.players.push(new Player('Lynn'))
//dealRound(blackJack.shoe, blackJack.players, blackJack.dealer)
//console.log(render(blackJack))
//blackJack.players.push(new Player('Tom'))
//dealRound(blackJack.shoe, blackJack.players, blackJack.dealer)
//console.log(render(blackJack))
//dealRound(blackJack.shoe, blackJack.players, blackJack.dealer)
//hit(blackJack.shoe, blackJack.players[0].hands[0])
//console.log(render(blackJack))
