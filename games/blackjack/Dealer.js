'use strict'

var Entity = require('./Entity')

module.exports = Dealer

function Dealer (hand) {
  Entity.call(this)
  this.hand = hand 
}
