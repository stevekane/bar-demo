'use strict'

var fns = require('../utils/functions')
var pluck = fns.pluck
var addLists = fns.addLists

module.exports = Hand

function Hand (downCard, upCards) {
  this.downCard = downCard
  this.upCards = upCards
}

Hand.calculateValues = function (hand) {
  return hand.upCards.concat(hand.downCard)
                     .map(pluck('values'))
                     .reduce(addLists)
}
