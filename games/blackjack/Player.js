'use strict'

var Hand = require('./Hand')

module.exports = Player

function Player (name) {
  this.name = name
  this.hands = [new Hand.Empty]
  this.currentBet = 0
  this.doneBetting = false
  this.donePostDeal = false
  this.doneActions = false
}
