const http = require('http')
const prettyLog = require('pretty-log-2')
const sio = require('socket.io')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const Clock = require('./src/Clock')
const Engine = require('./src/Engine')
const BlackJack = require('./games/blackjack/BlackJack')
const serve = serveStatic('public/', {index: 'screen.html'})
const DEFAULT_PORT = 4005
const PORT = process.env.PORT || DEFAULT_PORT

const httpServer = http.Server(function (req, res) {
  serve(req, res, finalhandler(req, res))
})

const io = sio(httpServer)
const engine = new Engine(new Clock, io)
const game = new BlackJack(engine)

function makeUpdate (game) {
  return function update () {
    engine.clock.tick()           
    game.update(engine.clock.dT)
    engine.screens.emit('update', game.state, engine.events)
    engine.clients.emit('update', game.state, engine.events)
    engine.events.splice(0)
    for (var i = 0; i < engine.clients.sockets.length; i++) {
      engine.clients.sockets[i].events.splice(0) 
    }
  }
}

engine.screens.on('connection', function handleNewScreen (socket) {
  console.log('screen added', socket.id)
  socket.on('disconnect', function handleScreenDisconnect () {
    console.log('screen removed', socket.id)
  })
})

setInterval(makeUpdate(game), 300)
httpServer.listen(PORT, '0.0.0.0')
