'use strict'

var Hand = require('./Hand')
var calculateValues = Hand.calculateValues

module.exports.renderCard = renderCard
module.exports.renderHand = renderHand
module.exports.renderPlayer = renderPlayer
module.exports.renderDealer = renderDealer
module.exports.renderShoe = renderShoe
module.exports.renderBlackJack = renderBlackJack

function renderCard (card) {
  return card.name + card.suit
}

function renderHand (hand) {
  var downCard = renderCard(hand.downCard)
  var upCards = hand.upCards.map(renderCard).join(', ')
  var values = calculateValues(hand).join(', ') 

  return "\tDOWN: " + downCard + 
         "  UP: " + upCards + 
         "  VALUES: " + values
}

function renderPlayer (player) {
  var name = player.name
  var hand = player.hand ? renderHand(player.hand) : 'no hand'

  return name + " has " + hand
}

function renderDealer (dealer) {
  var hand = dealer.hand ? renderHand(dealer.hand) : 'no hand'

  return "Dealer has " + hand
}

function renderShoe (shoe) {
  return "SHOE: " + shoe.length + " cards"
}

function renderBlackJack (blackJack) {
  var shoeText = renderShoe(blackJack.shoe)
  var dealerText = renderDealer(blackJack.dealer) 
  var playerText = blackJack.players.map(renderPlayer).join('\n')

  return shoeText + "\n" + 
         dealerText + "\n" +
         playerText
}
