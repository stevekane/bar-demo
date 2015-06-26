'use strict'

var react = require('react')
var h1 = react.DOM.h1
var h2 = react.DOM.h2
var ul = react.DOM.ul
var li = react.DOM.li
var div = react.DOM.div
var img = react.DOM.img
var span = react.DOM.span

function Component (hash) {
  return react.createFactory(react.createClass(hash))
}

var CardComponent = Component({
  render: function () {
    var card = this.props

    return span({}, card.name + card.suit)
  } 
})

var HandComponent = Component({
  render: function () {
    var hand = this.props         
    var cards = []

    for (var i = 0; i < hand.cards.length; i++) {
      cards.push(li({key: i}, CardComponent(hand.cards[i])))
    }

    return ul({}, cards)
  } 
})

var DealerComponent = Component({
  render: function () {
    var dealer = this.props
    var content = dealer.hand 
      ? HandComponent(dealer.hand) 
      : null

    return div({},
      h2({}, 'Dealer'),
      content
    )
  }
})

var PlayerComponent = Component({
  render: function () {
    var player = this.props          
    var hands = []

    for (var i = 0; i < player.hands.length; i++) {
      hands.push(li({key: i}, HandComponent(player.hands[i])))
    }

    var content = hands.length ? ul({}, hands) : null

    return div({},
      h2({}, 'Player'),
      content
    )
  }
})

var MainComponent = Component({
  render: function () {
    var state = this.props
    var players = []

    for (var i = 0; i < state.activePlayers.length; i++) {
      players.push(li({key: i}, PlayerComponent(state.activePlayers[i])))
    }

    return div({}, 
      h1({}, state.activeStateName),
      h2({}, Math.floor(state.timeLeft / 1000)),
      DealerComponent(state.dealer),
      ul({}, players)
    )
  } 
})

module.exports.CardComponent = CardComponent
module.exports.HandComponent = HandComponent
module.exports.DealerComponent = DealerComponent
module.exports.PlayerComponent = PlayerComponent
module.exports.MainComponent = MainComponent
