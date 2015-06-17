'use strict'

var react = require('react')
var h1 = react.DOM.h1
var h2 = react.DOM.h2
var ul = react.DOM.ul
var li = react.DOM.li
var div = react.DOM.div
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

    return div({},
      h2({}, 'Dealer'),
      HandComponent(dealer.hand)
    )
  }
})

var PlayerComponent = Component({
  render: function () {
    var player = this.props          
    var hands = []

    for (var i = 0; i < player.hands.length; i++) {
      hands.push(li({key: i}, HandComponent({}, player.hands[i])))
    }

    return div({},
      h2({}, 'Player'),
      ul({}, hands)
    )
  }
})

function renderShoeSize (shoe) {
  var out = ""

  for (var i = 0; i < shoe.length; i++) {
    out += '|'
  }
  return out
}

var MainComponent = Component({
  render: function () {
    var game = this.props
    var players = []

    for (var i = 0; i < game.players.length; i++) {
      players.push(li, {key: i}, PlayerComponent(game.players[i])) 
    }

    return div({}, 
      h1({}, game.activeState),
      h2({}, 'Shoe: ' + renderShoeSize(game.shoe)),
      DealerComponent(game.dealer),
      ul({}, players)
    )
  } 
})

module.exports.CardComponent = CardComponent
module.exports.HandComponent = HandComponent
module.exports.DealerComponent = DealerComponent
module.exports.PlayerComponent = PlayerComponent
module.exports.MainComponent = MainComponent
