'use strict'

var Entity = require('./Entity')

module.exports = Player

function Player (user) {
  Entity.call(this)
  this.user = user
  this.hands = []
  this.currentBet = 0
  this.doneBetting = false
  this.donePostDeal = false
  this.doneActions = false
}
