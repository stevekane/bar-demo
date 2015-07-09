import {Server} from 'http'
import Protobuf from 'protobufjs'
import {pp, log} from 'pretty-log-2'
import SocketServer from 'socket.io'
import servStatic from 'serve-static'
import finalHandler from 'finalHandler'
import {cleanupRound, dealRound, stand, 
        hit, split, doubleDown} from './transactions'
import {isHand, isPlayer, isCard, isDealer} from './predicates'
import {Player, Dealer} from './Entities'
import BlackJackTable from './BlackJackTable'
import Clock from './Clock'

function handleRequest (req, res) {
  server(req, res, finalHander(req, res))
}

function encode (byteBuffer, ProtoDef, data) {
  return new ProtoDef(data).encode(byteBuffer)
                           .flip()
                           .toArrayBuffer()
}

const {ByteBuffer} = Protobuf
const httpServer = Server(handleRequest)
const io = SocketServer(httpServer)
const stateBuffer = ByteBuffer.allocate(1024)
const BlackJackProto = Protobuf.protoFromFile('src/BlackJackTable.proto')
const GameStateBuf = BlackJackProto.build('BlackJackTable')

let table = new BlackJackTable(new Dealer)
let player1 = new Player(5000)
let player2 = new Player(5000)

table.attach(table.root, player1)
table.attach(table.root, player2)
dealRound(table)

let cards = [...table.where(isCard)]
let players = [...table.where(isPlayer)]
let hands = [...table.where(isHand)]
let dealer = table.first(isDealer)
let gameState = {cards, players, hands, dealer}

pp(cards)
pp(players)
pp(hands)
pp(dealer)

let encoded = encode(stateBuffer, GameStateBuf, gameState)
let asJson = JSON.stringify(gameState)

console.log(encoded.byteLength)
console.log(Buffer.byteLength(asJson, "utf-8"))

let hydrated = GameStateBuf.decode(encoded)
