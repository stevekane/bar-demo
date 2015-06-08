'use strict'

module.exports.dealHand = dealHand
module.exports.dealRound = dealRound
module.exports.hit = hit
module.exports.stand = stand

function dealHand (shoe, hand) {
  hand.downCards.splice(0)
  hand.upCards.splice(0)
  hand.downCards.push(shoe.pop())
  hand.upCards.push(shoe.pop())
}

function dealRound (shoe, players, dealer) {
  for (var i = 0; i < players.length; i++) {
    players[i].hands.splice(1)
    dealHand(shoe, players[i].hands[0])
  }
  dealHand(shoe, dealer.hand)
}

function hit (shoe, hand) {
  hand.upCards.push(shoe.pop())
}

function stand (target) {
  target.active = false
}
