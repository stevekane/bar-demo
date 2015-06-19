'use strict'

var sio = require('socket.io-client')
var loading = require('./loading')
var loadJSON = loading.loadJSON
var loadImage = loading.loadImage
var SERVER_ADDRESS = window.location.origin + '/screens'
var socket = sio(SERVER_ADDRESS)

function loadAssets () {
  return Promise.all([
    loadImage(window.location.origin + '/images/playingCards.png'),
    loadJSON(window.location.origin + '/json/playingCards.json')
  ])
}

function boot (assets) {
  var socket = sio(SERVER_ADDRESS)
  var timerNode = document.getElementById('timer') 

  socket.on('connect', function (ev) {
    console.log(window.navigator.userAgent)
    socket.on('update', function (state, events) { 
      timerNode.innerText = Math.ceil(state.timeLeft / 1000)
    })
  })
}

loadAssets()
.then(boot)
