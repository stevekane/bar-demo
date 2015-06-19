const http = require('http')
const prettyLog = require('pretty-log-2')
const sio = require('socket.io')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const Clock = require('./src/Clock')
const BlackJack = require('./games/blackjack/BlackJack')
const serve = serveStatic('public/', {index: 'screen.html'})
const DEFAULT_PORT = 4005
const PORT = process.env.PORT || DEFAULT_PORT

const httpServer = http.Server(function (req, res) {
  serve(req, res, finalhandler(req, res))
})

const io = sio(httpServer)
const engine = {
  clock: new Clock,
  events: [],
  screens: io.of('/screens'),
  clients: io.of('/clients') 
}
const game = new BlackJack(engine)

function makeUpdate (game) {
  return function update () {
    engine.clock.tick()           
    game.update(engine.clock.dT)
    engine.screens.emit('update', game.state, engine.events)
    engine.clients.emit('update', game.state, engine.events)
    engine.events.splice(0)
  }
}

engine.clients.on('connection', function handleNewClient (socket) {
  console.log('client added', socket.id)
  socket.on('disconnect', function handleClientDisconnect () {
    console.log('client removed', socket.id)
  })
})

engine.screens.on('connection', function handleNewScreen (socket) {
  console.log('screen added', socket.id)
  socket.on('disconnect', function handleScreenDisconnect () {
    console.log('screen removed', socket.id)
  })
})

setInterval(makeUpdate(game), 100)
httpServer.listen(PORT, '0.0.0.0')
