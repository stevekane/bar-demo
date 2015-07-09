'use strict'

import {pp, log} from 'pretty-log-2'
import Protobuf from 'protobufjs'
import {GameState, Hand, Card, Player, Dealer} from './GameState'
import {cleanupRound, dealRound, hit, 
        stand, split, doubleDown} from './transactions'
import HAND_STATUS from './globals/HAND_STATUS'

const {ByteBuffer} = Protobuf
const stateBuffer = ByteBuffer.allocate(1024)
const GameStateProto = Protobuf.protoFromFile('src/GameState.proto')
const GameStateBuf = GameStateProto.build('GameState')

function encode (byteBuffer, ProtoDef, data) {
  return new ProtoDef(data).encode(byteBuffer)
                           .flip()
                           .toArrayBuffer()
}

let d = new Dealer
let p1 = new Player(5000)
let p2 = new Player(5000)
let gs = new GameState(d, [p1, p2])

dealRound(gs)
hit(p1.hands[0])
stand(p1.hands[0])
doubleDown(p2, p2.hands[0])
hit(p2.hands[0])
cleanupRound(gs)

let binaryState = encode(stateBuffer, GameStateBuf, gs)
let clientState = GameStateBuf.decode(binaryState)

pp(clientState)
