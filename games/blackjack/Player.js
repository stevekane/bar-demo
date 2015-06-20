'use strict'

var Entity = require('./Entity')

module.exports = Player

function Player () {
  Entity.call(this)
  this.hands = []
  this.chips = 10000
  this.currentBet = 0
  this.doneBetting = false
  this.donePostDeal = false
  this.doneActions = false
}
