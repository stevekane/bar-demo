'use strict'

import Signal from './Signal'

export default class SocketPool extends Signal {
  constructor (socketServer) {
    super()

    socketServer.on('connection', (socket) => {
      socket.events = []
      this.addedSockets.push(socket)
      socket.on('data', (e) => socket.events.push(e))
      socket.on('disconnect', () => this.removedSockets.push(socket))
    })
    this.addedSockets = []
    this.removedSockets = []
    this.socketServer = socketServer
  }

  tick () {
    let allSockets = this.socketServer.sockets.sockets

    this.addedSockets.splice(0)
    this.removedSockets.splice(0)
    for (let socket of allSockets) socket.events.splice(0)
  }
}
