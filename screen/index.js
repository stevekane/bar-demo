'use strict'

var react = require('react')
var sio = require('socket.io-client')
var prettyLog = require('pretty-log-2')
var components = require('./components')
var Game = require('../games/blackjack/BlackJack')
var MainComponent = components.MainComponent
var SERVER_ADDRESS = 'http://localhost:4005'
var socket = sio(SERVER_ADDRESS)
var game = new Game(false);

socket.on('connect', function (ev) {
  socket.emit('login', {name: 'Steve', password: 'Booty'})
  socket.on('begin', function handleBegin (data) {
    console.log('begin');
    //requestAnimationFrame(makeRender())
  })
  socket.on('update', function handleUpdate (data) {
    game.state = data
  })
})

//function makeRender () {
//  return function render () {
//    react.render(MainComponent(game.state), document.body)
//    requestAnimationFrame(render)
//  }
//}
