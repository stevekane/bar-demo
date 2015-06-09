'use strict'

var fns = require('../utils/functions')
var pluck = fns.pluck
var addLists = fns.addLists

module.exports = Hand

function Hand (cards) {
  this.cards = cards
}

Hand.Empty = function () {
  return new Hand([])
}

Hand.calculateValues = function (hand) {
  if (!hand.cards.length) return []

  var values = hand.cards[0].values

  for (var i = 1; i < hand.cards.length; i++) {
    values = addLists(values, hand.cards[i].values)
  }
  return values
}
