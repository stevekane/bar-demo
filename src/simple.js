'use strict'

import {pp, log} from 'pretty-log-2'
import Protobuf from 'protobufjs'
import {GameState, Hand, Card, Player, Dealer} from './GameState'
import HAND_STATUS from './HAND_STATUS'

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
let p1 = new Player(500, new Hand(HAND_STATUS.Active, false, 50, 
                    [new Card.Random, new Card.Random]))
let p2 = new Player(500, new Hand(HAND_STATUS.Active, false, 50, 
                    [new Card.Random, new Card.Random]))
let gs = new GameState(d, [p1, p2])


let binaryState = encode(stateBuffer, GameStateBuf, gs)
pp(gs)
let asJson = JSON.stringify(gs)
log(binaryState.byteLength)
log(Buffer.byteLength(asJson, 'utf-8'))
