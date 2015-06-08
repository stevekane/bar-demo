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
  return hand.cards.map(pluck('values'))
                   .reduce(addLists, [])
}
