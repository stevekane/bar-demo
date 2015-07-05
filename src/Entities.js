'use strict'

import Entity from './Entity'

const {random, floor} = Math

function randFrom (array) {
  return array[floor(random() * array.length)]
}

export class Card extends Entity {
  constructor (suit, name) {
    super('Card')  
    this.suit = suit
    this.name = name
  }

  static Random (suits, cards) {
    return new Card(randFrom(suits), randFrom(cards)) 
  }
}

export class Hand extends Entity {
  constructor (betValue, status, doubledDown=false) {
    super('Hand')
    this.betValue = betValue
    this.status = status
    this.doubledDown = doubledDown
  }
}

export class Player extends Entity {
  constructor (chipCount) {
    super('Player')
    this.chipCount = chipCount
  }
}

export class Dealer extends Entity {
  constructor () {
    super('Dealer')
  }
}
