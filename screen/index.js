'use strict'

var prettyLog = require('pretty-log-2')
var react = require('react')
var h1 = react.DOM.h1
var ul = react.DOM.ul
var li = react.DOM.li
var div = react.DOM.div
var span = react.DOM.span
var sio = require('socket.io-client')
var BlackJack = require('../games/blackjack/BlackJack')

var SERVER_ADDRESS = 'http://localhost:4005'
var socket = sio(SERVER_ADDRESS)
var game = new BlackJack

function Component (hash) {
  return react.createFactory(react.createClass(hash))
}

socket.on('connect', function (ev) {
  socket.emit('login', {name: 'Steve', password: 'Booty'})
  socket.on('update', function handleUpdate (data) {
    game.dealer = data.dealer
    game.players = data.players
    game.shoe = data.shoe
  })
})

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
      h1({}, 'Dealer'),
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
      h1({}, 'Player'),
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
      h1({}, 'Shoe: ' + renderShoeSize(game.shoe)),
      DealerComponent(game.dealer),
      ul({}, players)
    )
  } 
})

function makeRender () {
  return function render () {
    react.render(MainComponent(game), document.body)
    requestAnimationFrame(render)
  }
}

requestAnimationFrame(makeRender())
