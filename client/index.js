'use strict'

var sio = require('socket.io-client')
var SERVER_ADDRESS = window.location.origin + '/clients'
var socket = sio(SERVER_ADDRESS)

socket.on('connect', function (ev) {
  console.log(window.navigator.userAgent)
  socket.on('update', function (state, events) { 
  })
})

window.bet = function (amount) {
  socket.emit('bet', amount)
}

window.stand = function () {
  socket.emit('stand')
}

window.hit = function () {
  socket.emit('hit')
}
