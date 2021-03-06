'use strict'

module.exports.dealHand = dealHand
module.exports.dealRound = dealRound
module.exports.collectRound = collectRound
module.exports.hit = hit
module.exports.stand = stand

function dealHand (shoe, hand) {
  hand.cards.push(shoe.pop())
  hand.cards.push(shoe.pop())
}

function dealRound (shoe, players, dealer) {
  for (var i = 0; i < players.length; i++) {
    dealHand(shoe, players[i].hands[0])
  }
  dealHand(shoe, dealer.hand)
}

function collectRound (shoe, players, dealer) {
  for (var i = 0; i < players.length; i++) {
    players[i].hands.splice(1)
    players[i].hands[0].cards.splice(0)
  }
  dealer.hand.cards.splice(0)
}

function split (player, hand) {
  var targetHand = player.hands.splice(player.hands.indexOf(hand), 1)
   
}

function hit (shoe, hand) {
  hand.cards.push(shoe.pop())
}

function stand (target) {
  target.active = false
}
