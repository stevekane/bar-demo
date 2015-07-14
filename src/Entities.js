'use strict'

import {v4} from 'node-uuid'
import {within, randRange} from './utils/math'
import {assert, ofType} from './guards'
import HAND_STATUS from './globals/HAND_STATUS'


//SUITS => [Diamonds, Hearts, Spades, Clubs]
//RANKS => [Ace, Two, Three, Four, Five, Six, Seven, 
//          Eight, Nine, Ten, Jack, Queen, King]

const MIN_SUIT = 0
const MAX_SUIT = 3
const MIN_RANK = 0
const MAX_RANK = 12

//suit [0..3] rank [0..12]
export class Card {
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

export class Hand {
  constructor (status, doubledDown, bet, cards=[]) {
    this.status = status
    this.doubledDown = doubledDown
    this.bet = bet
    this.cards = cards 
  }
}

export class Player {
  constructor (chipCount, hands=[]) {
    this.id = v4()
    this.chipCount = chipCount
    this.hands = hands
  }
}

export class Dealer {
  constructor (hand=null) {
    if (hand) ofType(Hand, hand)

    this.hand = hand 
  }
}

export class BlackJackTable {
  constructor (activeStateName, dealer, players=[]) {
    this.activeStateName = activeStateName
    this.dealer = dealer 
    this.players = players
  }
}
