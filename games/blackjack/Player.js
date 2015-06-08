'use strict'

var Hand = require('./Hand')

module.exports = Player

function Player (name) {
  this.doneBetting = false
  this.donePostDeal = false
  this.doneActions = false
  this.name = name
  this.hands = [new Hand.Empty]
}
