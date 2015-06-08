'use strict'

var renderConsole = require('./render-console')
var render = renderConsole.renderBlackJack
var fns = require('../utils/functions')
var shuffle = fns.shuffle
var lowest = fns.lowest
var transactions = require('./transactions')
var dealRound = transactions.dealRound
var hit = transactions.hit
var Hand = require('./Hand')
var calculateValues = Hand.calculateValues
var Shoe = require('./Shoe')
var Player = require('./Player')
var Dealer = require('./Dealer')

module.exports = BlackJack

function BlackJack () {
  this.shoe = new Shoe.Scrambled
  this.dealer = new Dealer(new Hand.Empty)
  this.players = []
}

//:: target Player | Dealer
var blackJack = new BlackJack

blackJack.players.push(new Player('Steve'))
blackJack.players.push(new Player('Lynn'))
dealRound(blackJack.shoe, blackJack.players, blackJack.dealer)
console.log(render(blackJack))
blackJack.players.push(new Player('Tom'))
dealRound(blackJack.shoe, blackJack.players, blackJack.dealer)
console.log(render(blackJack))
dealRound(blackJack.shoe, blackJack.players, blackJack.dealer)
hit(blackJack.shoe, blackJack.players[0].hands[0])
console.log(render(blackJack))
