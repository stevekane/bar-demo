'use strict'

var Card = require('./Card')
var fns = require('../utils/functions')
var shuffle = fns.shuffle

module.exports = Shoe

function Shoe (deckCount) {
  var cards = []

  deckCount = deckCount || 1
  for (var i = 0; i < deckCount; i++) {
    cards = cards.concat(new Card.Deck()) 
  } 
  return cards
}

Shoe.Scrambled = function (deckCount) {
  return shuffle(new Shoe(deckCount))
}
