var prettyLog = require('pretty-log-2')
var react = require('react')
var sio = require('socket.io-client')

var SERVER_ADDRESS = 'http://localhost:4005'

var socket = sio(SERVER_ADDRESS)

socket.on('connect', function (ev) {
  console.log(ev)
});
