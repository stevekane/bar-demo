'use strict'

var react = require('react')
var sio = require('socket.io-client')
var loading = require('./loading')
var components = require('./components')
var MainComponent = components.MainComponent
var loadJSON = loading.loadJSON
var loadImage = loading.loadImage
var SERVER_ADDRESS = window.location.origin + '/screens'
var game = {
  state: null
}

function loadAssets () {
  return Promise.all([
    loadImage(window.location.origin + '/images/playingCards.png'),
    loadJSON(window.location.origin + '/json/playingCards.json')
  ])
}

function boot (assets) {
  var socket = sio(SERVER_ADDRESS)

  socket.on('connect', function (ev) {
    console.log(window.navigator.userAgent)
    socket.on('update', function (state, events) { 
      game.state = state
    })
  })
  render()
}

function render () {
  if (game.state) {
    react.render(MainComponent(game.state), document.body)
  }
  requestAnimationFrame(render)
}

loadAssets()
.then(boot)
