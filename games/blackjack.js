'use strict'

var prettyLog = require('pretty-log-2')
var pp = prettyLog.pp
var log = prettyLog.log

var UPDATE_RATE = 25 //ms

function pluck (attrName) {
  return function innerPluck (obj) {
    return obj[attrName] 
  }
}

function invoke (fnName) {
  return function innerInvoke (obj) {
    return obj[fnName]() 
  }
}

function addLists (list1, list2) {
  var results = []

  for (var i = 0; i < list1.length; i++) {
    for (var j = 0; j < list2.length; j++) {
      results.push(list1[i] + list2[j]) 
    } 
  }
  return results
}

function shuffle (o) {
  for(var j, x, i = o.length; 
      i; 
      j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o; 
}

function CardValue (name, values) {
  this.name = name
  this.values = values
}

var suits = ['D', 'H', 'S', 'C']
var cardValues = [
  new CardValue('A', [1, 11]),
  new CardValue('2', [2]),
  new CardValue('3', [3]),
  new CardValue('4', [4]),
  new CardValue('5', [5]),
  new CardValue('6', [6]),
  new CardValue('7', [7]),
  new CardValue('8', [8]),
  new CardValue('10', [10]),
  new CardValue('J', [10]),
  new CardValue('Q', [10]),
  new CardValue('K', [10])
]

function Card (suit, name, values) {
  this.suit = suit
  this.name = name
  this.values = values
}

Card.prototype.toAscii = function () {
  return this.name + this.suit
}

function Deck () {
  var deck = []
  var suit
  var cardValue

  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < cardValues.length; j++) {
      //TODO: shared reference for cardvalue..
      suit = suits[i]
      cardValue = cardValues[j]
      deck.push(new Card(suit, 
                         cardValue.name, 
                         cardValue.values))
    } 
  }
  return deck 
}

function Shoe (deckCount) {
  deckCount = deckCount || 1

  var cards = []

  for (var i = 0; i < deckCount; i++) {
    cards = cards.concat(new Deck()) 
  } 
  return cards
}

Shoe.scrambled = function (deckCount) {
  return shuffle(new Shoe(deckCount))
}

function Hand (downCard, upCards) {
  this.downCard = downCard
  this.upCards = upCards

  Object.defineProperty(this, 'values', {
    get: function () { 
      return this.upCards.concat(this.downCard)
                         .map(pluck('values'))
                         .reduce(addLists)
    } 
  })
}

Hand.prototype.toAscii = function () {
  var downCard = this.downCard.toAscii()
  var upCards = this.upCards.map(invoke('toAscii'))
                            .join(', ')
  var values = this.values.join(', ')

  return ` \tDOWN: ${downCard} \t UP: ${upCards} \tVALUES: ${values}`
}

//:: String -> Number -> Maybe Hand -> Player
function Player (name, chipCount, hand) {
  this.name = name
  this.chipCount = chipCount
  this.hand = hand
}

Player.prototype.toAscii = function () {
  return `${this.name} has ${this.hand ? this.hand.toAscii() : 'no hand'}`
}

//:: Maybe Hand -> Dealer
function Dealer (hand) {
  this.hand = hand
}

Dealer.prototype.toAscii = function () {
  return `Dealer has ${this.hand ? this.hand.toAscii() : 'no hand'}`
}

function BlackJack () {
  this.shoe = new Shoe.scrambled
  this.dealer = new Dealer
  this.players = []
}

BlackJack.prototype.toAscii = function () {
  var shoeCount = this.shoe.length
  var dealerText = this.dealer.toAscii()
  var playerText = this.players.map(invoke('toAscii'))
                                     .join('\n')

  //string templates are pretty sensitive to spacing...
  return (
`
SHOE: ${shoeCount} cards
${dealerText}
${playerText}
`)
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
log(blackJack.toAscii())

blackJack.players.push(new Player('Tom', 100))

blackJack.dealRound()
log(blackJack.toAscii())
