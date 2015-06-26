'use strict'

const EventEmitter = require('events').EventEmitter

module.exports = Engine

function Engine (clock, socketServer) {
  EventEmitter.call(this)
  this.clock = clock
  this.socketServer = socketServer
  this.screens = socketServer.of('/screens')
  this.clients = socketServer.of('/clients')
  this.events = []
}

Engine.prototype = Object.create(EventEmitter.prototype)
