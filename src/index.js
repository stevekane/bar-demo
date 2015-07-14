'use strict'

import {pp, log} from 'pretty-log-2'
import Protobuf from 'protobufjs'
import {BlackJackTable, Hand, Card, Player, Dealer} from './Entities'
import {cleanupRound, dealRound, hit, stand, split, doubleDown} from './transactions'
import Clock from './Clock'
import SocketPool from './SocketPool'
import HAND_STATUS from './globals/HAND_STATUS'
import {Waiting, Betting, Acting, Scoring} from './globals/GAME_STATES'

const BETTING_TIMER = 3000
const ACTING_TIMER = 15000
const SCORING_TIMER = 3000

const TICK_RATE = 1000

const SOCKET_PORT = process.env.SOCKET_PORT || 4004

const {ByteBuffer} = Protobuf
const stateBuffer = ByteBuffer.allocate(1024)
const BlackJackTableProto = Protobuf.protoFromFile('src/BlackJackTable.proto')
const BlackJackTableBuf = BlackJackTableProto.build('BlackJackTable')

const clock = new Clock
const socketPool = new SocketPool(SOCKET_PORT)
const signals = {clock, socketPool}

function broadcast (pool, table) {
  for (let socket of pool.sockets) socket.send(JSON.stringify(table))
}

function encode (byteBuffer, ProtoDef, data) {
  return new ProtoDef(data)
    .encode(byteBuffer)
    .flip()
    .toArrayBuffer()
}

function updateSignals (signals) {
  for (let key in signals) signals[key].tick()
}

function transitionTo (table, stateName) {
  table.stateName = stateName

  switch (stateName) {
    case Waiting: table.timer = 0
    case Betting: table.timer = BETTING_TIMER
    case Acting:  table.timer = ACTING_TIMER
    case Scoring: table.timer = SCORING_TIMER
  }
}

function tableIsEmpty (table) {
  return table.inactivePlayers.length === 0 && 
         table.players.length === 0
}

function updateWaiting (signals, table) {}

function updateBetting (signals, table) {
  let {playerEvents} = signals
  let timeElapsed = table.timer <= 0
  let targetState = hasActivePlayers ? Acting : Betting
  let hasActivePlayers = table.players.length > 0

  //if time has elapsed, check if active players and transition
  if (timeElapsed) return transitionTo(table, targetState)
  
  //loop over input queues, check for bet events
  //if a bet action occurs, perform a bet
  //joinRound(gameState, player)
  //if the timer has hit 0, it's time to move on
}

function updateActing (signals, table) {
  if (table.timer <= 0) return transitionTo(table, Scoring)
}

function updateScoring (signals, table) {}

function updateTable (signals, table) {
  let {socketPool} = signals
  let noPlayers = tableIsEmpty(table)
  let arePlayers = !noPlayers
  let alreadyWaiting = table.stateName === Waiting

  for (let addedSocket of socketPool.addedSockets) {
    console.log('Add player for new socket')
  }

  for (let removedSocket of socketPool.removedSockets) {
    console.log('Remove player for disconnected socket')
  }

  if      (noPlayers)                    transitionTo(table, Waiting)
  else if (arePlayers && alreadyWaiting) transitionTo(table, Betting)
  else                                   table.timer -= signals.clock.dT

  switch (table.stateName) {
    case Waiting: return updateWaiting(signals, table)
    case Betting: return updateBetting(signals, table)
    case Acting:  return updateActing(signals, table)
    case Scoring: return updateScoring(signals, table)
  }
}

function makeUpdate (table) {
  return function () {
    broadcast(signals.socketPool, table)
    updateTable(signals, table)
    updateSignals(signals) 
  }
}

let t0 = 0
let d = new Dealer
let gs = new BlackJackTable(Waiting, t0, d, [], [])

setInterval(makeUpdate(gs), TICK_RATE)
