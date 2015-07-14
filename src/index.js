'use strict'

import {pp, log} from 'pretty-log-2'
import Protobuf from 'protobufjs'
import {BlackJackTable, Hand, Card, Player, Dealer} from './Entities'
import {cleanupRound, dealRound, hit, stand, split, doubleDown} from './transactions'
import Clock from './Clock'
import HAND_STATUS from './globals/HAND_STATUS'
import GAME_STATES from './globals/GAME_STATES'

const {ByteBuffer} = Protobuf
const stateBuffer = ByteBuffer.allocate(1024)
const BlackJackTableProto = Protobuf.protoFromFile('src/BlackJackTable.proto')
const BlackJackTableBuf = BlackJackTableProto.build('BlackJackTable')

function encode (byteBuffer, ProtoDef, data) {
  return new ProtoDef(data).encode(byteBuffer)
                           .flip()
                           .toArrayBuffer()
}

function updateSignals (signals) {
  for (let key in signals) signals[key].tick()
}

function updateWaiting (signals, table) {
  log('waiting')     
}

function updateBetting (signals, table) {
  log('betting')     
}

function updateActing (signals, table) {
  log('acting')     
}

function updateScoring (signals, table) {
  log('scoring')     
}

function updateTable (signals, table) {
  switch (table.activeStateName) {
    case GAME_STATES.Waiting: return updateWaiting(signals, table)
    case GAME_STATES.Betting: return updateBetting(signals, table)
    case GAME_STATES.Acting: return updateActing(signals, table)
    case GAME_STATES.Scoring: return updateScoring(signals, table)
    default: throw new Error('Not recognized GAME STATE')
  }
}

function makeUpdate (table) {
  return function () {
    updateSignals(signals) 
    updateTable(signals, table)
  }
}

let clock = new Clock
let signals = {clock}
let d = new Dealer
let p1 = new Player(5000)
let p2 = new Player(5000)
let gs = new BlackJackTable(GAME_STATES.Waiting, d, [p1, p2])

setInterval(makeUpdate(gs), 1000)
