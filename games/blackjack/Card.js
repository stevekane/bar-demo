'use strict'

module.exports = Card

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

//constructor that returns entire standard 52-card deck
Card.Deck = function () {
  var deck = []
  var suit
  var cardValue

  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < cardValues.length; j++) {
      suit = suits[i]
      cardValue = cardValues[j]
      deck.push(new Card(suit, cardValue.name, cardValue.values))
    } 
  }
  return deck 
}
