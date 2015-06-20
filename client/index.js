'use strict'

var sio = require('socket.io-client')
var SERVER_ADDRESS = window.location.origin + '/clients'
var socket = sio(SERVER_ADDRESS)

socket.on('connect', function (ev) {
  console.log(window.navigator.userAgent)
  socket.on('update', function (state, events) { 
  })
})
