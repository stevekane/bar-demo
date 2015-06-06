const http = require('http')
const uuid = require('node-uuid')
const prettyLog = require('pretty-log-2')
const sio = require('socket.io')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')
const serve = serveStatic('public/')

const DEFAULT_PORT = 4005
const PORT = process.env.PORT || DEFAULT_PORT

const httpServer = http.Server(function (req, res) {
  serve(req, res, finalhandler(req, res))
})
const io = sio(httpServer)

httpServer.listen(PORT, prettyLog.log.bind(null, PORT))
