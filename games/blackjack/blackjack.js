'use strict'

var renderConsole = require('./render-console')
var render = renderConsole.renderBlackJack
var fns = require('../utils/functions')
var Hand = require('./Hand')
var Shoe = require('./Shoe')
var Player = require('./Player')
var Dealer = require('./Dealer')
var shuffle = fns.shuffle

module.exports = BlackJack

function BlackJack () {
  this.shoe = new Shoe.Scrambled
  this.dealer = new Dealer
  this.players = []
}

// TRANSACTIONS!

function dealRound (blackJack) {
  if (!blackJack.players.length) return

  for (var i = 0; i < blackJack.players.length; i++) {
    blackJack.players[i].hand = new Hand(blackJack.shoe.pop(), 
                                         [blackJack.shoe.pop()])
  }
  blackJack.dealer.hand = new Hand(blackJack.shoe.pop(), 
                                   [blackJack.shoe.pop()])
}

function hit (shoe, hand) {
  hand.upCards.push(shoe.pop())
}

//:: Player | Dealer
function stand (target) {
  //TODO: Player/Dealer should possibly have boolean flag for done?
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
dealRound(blackJack)
console.log(render(blackJack))
blackJack.players.push(new Player('Tom', 100))
dealRound(blackJack)
console.log(render(blackJack))
dealRound(blackJack)
hit(blackJack.shoe, blackJack.players[0].hand)
console.log(render(blackJack))
