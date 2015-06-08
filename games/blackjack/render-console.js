'use strict'

var Hand = require('./Hand')
var calculateValues = Hand.calculateValues

module.exports.renderCard = renderCard
module.exports.renderHand = renderHand
module.exports.renderPlayer = renderPlayer
module.exports.renderDealer = renderDealer
module.exports.renderShoe = renderShoe
module.exports.render = render

function renderCard (card) {
  return card.name + card.suit
}

function renderHand (hand) {
  var cards = hand.cards.map(renderCard).join(' ')
  var values = calculateValues(hand).join(', ') 

  return "\t" + cards + 
         " (" + values + ")"
}

function renderPlayer (player) {
  var name = player.name
  var hand = player.hands.length 
    ? player.hands.map(renderHand).join('  ')
    : 'no hand'

  return name + " has " + hand
}

function renderDealer (dealer) {
  var hand = dealer.hand ? renderHand(dealer.hand) : 'no hand'

  return "Dealer has " + hand
}

function renderShoe (shoe) {
  return "SHOE: " + shoe.length + " cards"
}

function render (blackJack) {
  var shoeText = renderShoe(blackJack.shoe)
  var dealerText = renderDealer(blackJack.dealer) 
  var playerText = blackJack.players.map(renderPlayer).join('\n')

  return blackJack.stateManager.activeState.name + "\n" +
         shoeText + "\n" + 
         dealerText + "\n" +
         playerText
}
