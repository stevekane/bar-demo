'use strict'

import {pp, log} from 'pretty-log-2'
import Protobuf from 'protobufjs'
import {BlackJackTable, Hand, Card, Player, Dealer} from './Entities'
import {cleanupRound, dealRound, hit, stand, split, doubleDown} from './transactions'
import Clock from './Clock'
import HAND_STATUS from './globals/HAND_STATUS'
import {Waiting, Betting, Acting, Scoring} from './globals/GAME_STATES'

const BETTING_TIMER = 3000
const ACTING_TIMER = 15000
const SCORING_TIMER = 3000

const TICK_RATE = 200

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
  return table.inactivePlayers.length === 0 && table.players.length === 0
}

function updateBetting (signals, table) {
  log('betting')     
  //if all players have bet, go to acting
  if (table.inactivePlayers.length === 0) transitionTo(table, Acting)
  //if time has elapsed, check if active players and transition
  if (table.timer <= 0) 
  //loop over input queues, check for bet events
  //if a bet action occurs, perform a bet
  //joinRound(gameState, player)
  //if the timer has hit 0, it's time to move on
}

function updateActing (signals, table) {
  log('acting')     
}

function updateScoring (signals, table) {
  log('scoring')     
}

function updateTable (signals, table) {
  let noPlayers = tableIsEmpty(table)
  let arePlayers = !noPlayers
  let alreadyWaiting = table.stateName === Waiting

  if      (noPlayers)                    transitionTo(table, Waiting)
  else if (arePlayers && alreadyWaiting) transitionTo(table, Betting)
  else                                   table.timer -= signals.clock.dT

  switch (table.stateName) {
    case Betting: updateBetting(signals, table)
    case Acting:  updateActing(signals, table)
    case Scoring: updateScoring(signals, table)
  }
}

function makeUpdate (table) {
  return function () {
    updateSignals(signals) 
    updateTable(signals, table)
  }
}

//TODO: Model the inputQueus for connected players as Signal
let clock = new Clock
let signals = {clock}
let t0 = 0
let d = new Dealer
let p1 = new Player(5000)
let p2 = new Player(5000)
let gs = new BlackJackTable(Waiting, t0, d, [], [p1, p2])

setInterval(makeUpdate(gs), TICK_RATE)
