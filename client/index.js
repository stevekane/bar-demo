'use strict'

var sio = require('socket.io-client')
var SERVER_ADDRESS = window.location.origin + '/clients'
var socket = sio(SERVER_ADDRESS)
var betBtn = document.getElementById('bet')
var hitBtn = document.getElementById('hit')
var standBtn = document.getElementById('stand')

socket.on('connect', function (ev) {
  console.log(window.navigator.userAgent)
  socket.on('update', function (state, events) { 
  })
})

betBtn.addEventListener('click', bet)
betBtn.addEventListener('touchend', bet)
hitBtn.addEventListener('click', hit)
hitBtn.addEventListener('touchend', hit)
standBtn.addEventListener('click', stand)
standBtn.addEventListener('touchend', stand)

function bet () {
  socket.emit('bet', 500)
}

function stand () {
  socket.emit('stand')
}

function hit () {
  socket.emit('hit')
}
