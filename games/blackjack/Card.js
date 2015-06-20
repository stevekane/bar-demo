'use strict'

var Entity = require('./Entity')
var fns = require('../utils/functions')
var randFrom = fns.randFrom

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
  Entity.call(this)
  this.suit = suit
  this.name = name
  this.values = values
}

Card.Random = function () {
  var suit = randFrom(suits)
  var value = randFrom(cardValues)

  return new Card(suit, value.name, value.values)
}
