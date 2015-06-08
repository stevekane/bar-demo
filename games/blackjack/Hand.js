'use strict'

var fns = require('../utils/functions')
var pluck = fns.pluck
var addLists = fns.addLists

module.exports = Hand

function Hand (downCards, upCards) {
  this.downCards = downCards
  this.upCards = upCards
}

Hand.Empty = function () {
  return new Hand([], [])
}

Hand.calculateValues = function (hand) {
  return hand.upCards.concat(hand.downCards)
                     .map(pluck('values'))
                     .reduce(addLists)
}
