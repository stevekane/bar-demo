'use strict'

var prettyLog = require('pretty-log-2')
var react = require('react')
var components = require('./components')
var MainComponent = components.MainComponent
var sio = require('socket.io-client')

var SERVER_ADDRESS = 'http://localhost:4005'
var socket = sio(SERVER_ADDRESS)
var game = new BlackJackScreen(socket)

function BlackJackScreen (socket) {
  this.socket = socket
  this.state = {}
}

socket.on('connect', function (ev) {
  socket.emit('login', {name: 'Steve', password: 'Booty'})
  socket.on('begin', function handleBegin (data) {
    game.state = data
    requestAnimationFrame(makeRender())
  })
  socket.on('update', function handleUpdate (data) {
    game.state = data
  })
})

function makeRender () {
  return function render () {
    react.render(MainComponent(game.state), document.body)
    requestAnimationFrame(render)
  }
}
