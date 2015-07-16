'use strict'

import {Server as WebSocketServer} from 'ws'
import Signal from '../Signal'
import {remove} from '../utils/array'

export default class SocketPool extends Signal {
  constructor (port) {
    super()

    let socketServer = new WebSocketServer({port: port})
    let sockets = []
    let addedSockets = []
    let removedSockets = []

    function addSocket (socket) {
      function handleMessage (message) {
        socket.events.push(message)
      }
      function handleClose () {
        remove(sockets, socket) 
        remove(addedSockets, socket)
        removedSockets.push(socket)
      }

      socket.events = []
      addedSockets.push(socket)
      sockets.push(socket)
      socket.on('message', handleMessage)
      socket.on('close', handleClose)
    }

    socketServer.on('connection', addSocket)
    this.addedSockets = addedSockets
    this.removedSockets = removedSockets
    this.sockets = sockets
  }

  tick () {
    this.addedSockets.splice(0)
    this.removedSockets.splice(0)
    for (let socket of this.sockets) socket.events.splice(0)
  }
}
