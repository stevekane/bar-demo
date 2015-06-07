'use strict'

var renderConsole = require('./render-console')
var render = renderConsole.renderBlackJack
var fns = require('../utils/functions')
var Hand = require('./Hand')
var Shoe = require('./Shoe')
var Player = require('./Player')
var Dealer = require('./Dealer')
var shuffle = fns.shuffle

function BlackJack () {
  this.shoe = new Shoe.Scrambled
  this.dealer = new Dealer
  this.players = []
}

// TRANSACTIONS!
BlackJack.prototype.dealRound = function () {
  if (!this.players.length) return

  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hand = new Hand(this.shoe.pop(), [this.shoe.pop()])
  }
  this.dealer.hand = new Hand(this.shoe.pop(), [this.shoe.pop()])
}
// TRANSACTIONS -- END

var blackJack = new BlackJack

// add new players
// collect bets (duration)
// deal
// allow doubledown (duration)
// allow hit/stand (duration)
// deal the dealer 
// calculate results and distribute chips (duration)

blackJack.players.push(new Player('Steve', 100))
blackJack.players.push(new Player('Lynn', 100))
blackJack.dealRound()
console.log(render(blackJack))
blackJack.players.push(new Player('Tom', 100))
blackJack.dealRound()
console.log(render(blackJack))
blackJack.dealRound()
console.log(render(blackJack))
