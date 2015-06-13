const http = require('http')
const prettyLog = require('pretty-log-2')
const sio = require('socket.io')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const Engine = require('./src/Engine')
const Clock = require('./src/Clock')
const BlackJack = require('./games/blackjack/BlackJack')
const serve = serveStatic('public/')
const DEFAULT_PORT = 4005
const PORT = process.env.PORT || DEFAULT_PORT

const httpServer = http.Server(function (req, res) {
  serve(req, res, finalhandler(req, res))
})
const io = sio(httpServer)
const engine = new Engine(new Clock)
const bj = new BlackJack(engine)

function makeUpdate (eng, game) {
  return function update () {
    eng.clock.tick()           
    game.update(engine, game)
    io.to('loggedIn').emit('update', {
      shoe: game.shoe,
      players: game.players,
      dealer: game.dealer
    })
  }
}

io.on('connection', function handleNewClient (socket) {
  socket.join('loggingIn')
  socket.on('login', function handleLogin (data) {
    console.log('Login ', data)
    socket.leave('loggingIn')
    socket.join('loggedIn')
  })
  socket.on('logout', function handleLogout () {
    socket.leave('loggedIn') 
  })
  socket.on('disconnect', function handleDisconnect () {
    console.log('user disconnected') 
  })
})

setInterval(makeUpdate(engine, bj), 66)
httpServer.listen(PORT, prettyLog.log.bind(null, PORT))
