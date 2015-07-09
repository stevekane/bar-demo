'use strict'

import {pp} from 'pretty-log-2'
import {v4} from 'node-uuid'
import {within, randRange} from './utils/math'
import Enum from './Enum'
import {assert, ofType} from './guards'

//SUITS => [Diamonds, Hearts, Spades, Clubs]
//RANKS => [Ace, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King]

const HAND_STATUS = new Enum('Active', 'Standing', 'Busted', 'BlackJack')

const MIN_SUIT = 0
const MAX_SUIT = 3
const MIN_RANK = 0
const MAX_RANK = 12

//suit [0..3] rank [0..12]
class Card {
  constructor (suit, rank) {
    assert(within, MIN_SUIT, MAX_SUIT, suit)
    assert(within, MIN_RANK, MAX_RANK, rank)

    this.suit = suit
    this.rank = rank 
  }

  static Random () {
    let suit = randRange(MIN_SUIT, MAX_SUIT)
    let rank = randRange(MIN_RANK, MAX_RANK)

    return new Card(suit, rank)
  }
}

class Hand {
  constructor (status, doubledDown, bet, cards=[]) {
    this.status = status
    this.doubledDown = doubledDown
    this.bet = bet
    this.cards = cards 
  }
}

class Player {
  constructor (chipCount, hands=[]) {
    this.id = v4()
    this.chipdCount = chipCount
    this.hands = hands
  }
}

class Dealer {
  constructor (hand) {
    this.hand = hand 
  }
}

export default class GameState {
  constructor (dealer, players=[]) {
    this.dealer = dealer 
    this.player = players
  }
}

let d = new Dealer
let p1 = new Player(500, new Hand(HAND_STATUS.Active, false, 50, [new Card.Random, new Card.Random]))
let p2 = new Player(500, new Hand(HAND_STATUS.Active, false, 50, [new Card.Random, new Card.Random]))
let gs = new GameState(d, [p1, p2])
pp(gs)
