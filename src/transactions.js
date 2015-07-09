'use strict'

import {pp, log} from 'pretty-log-2'
import {doLists, lowest, contains, remove} from './utils/array'
import {Card, Hand, Player, Dealer} from './GameState'
import {isHand, isPlayer, isCard, isDealer} from './predicates'
import {sum} from './utils/math'
import HAND_STATUS from './globals/HAND_STATUS'
import CARD_VALUES from './globals/CARD_VALUES'

const {max} = Math
const MIN_BET = 500

function calculateChipCount (bet, chipCount) {
  return max(chipCount - bet, 0)
}

function calculateValues (cards) {
  var values = CARD_VALUES[cards[0].rank]

  for (var i = 1; i < cards.length; i++) {
    values = doLists(sum, values, CARD_VALUES[cards[i].rank])
  }
  return values
}

export function cleanupDealer (dealer) {
  dealers.hand = null
}

export function cleanupPlayer (player) {
  player.hands = []
}

export function cleanupRound (gameState) {
  cleanupDealer(gameState.dealer)
  for (let player of gameState.players) cleanupPlayer(player)
}

export function dealPlayer (player) {
  let c1 = new Card.Random
  let c2 = new Card.Random
  let newHand = new Hand(HAND_STATUS.Active, false, MIN_BET, [c1, c2])
  
  player.chipCount = calculateChipCount(MIN_BET, player.chipCount)
  player.hands = [newHand]
}

export function dealDealer (dealer) {
  let c1 = new Card.Random
  let c2 = new Card.Random
  let newHand = new Hand(HAND_STATUS.Active, false, 0, [c1, c2])
  
  dealer.hand = newHand
}

export function dealRound (gameState) {
  dealDealer(gameState.dealer)
  for (let player of gameState.players) dealPlayer(player)
}

export function stand (hand) {
  hand.status = hand.status !== HAND_STATUS.Active 
    ? hand.status 
    : HAND_STATUS.Standing
}

export function hit (hand) {
  if (hand.status !== HAND_STATUS.Active) return log('Not active')

  hand.cards.push(new Card.Random)

  let values = calculateValues(hand.cards)

  if      (lowest(values) > 21)  hand.status = HAND_STATUS.Busted
  else if (contains(values, 21)) hand.status = HAND_STATUS.Standing
  else if (hand.doubledDown)     hand.status = HAND_STATUS.Standing
  else                           hand.status = hand.status
}

export function split (player, hand) {
  let cards = hand.cards

  if (cards.length > 2)                   return log('More than 2 cards')
  if (cards[0].rank !== cards[1].rank)    return log('Not same rank!')
  if (hand.status !== HAND_STATUS.Active) return log('Not active')
  if (!player)                            return log('no owner for hand')

  let newCard1 = new Card.Random
  let newCard2 = new Card.Random
  let oldCard1 = hand.cards.pop()
  let oldCard2 = hand.cards.pop()
  let newHand1 = new Hand(HAND_STATUS.Active, false, MIN_BET, [newCard1, oldCard1])
  let newHand2 = new Hand(HAND_STATUS.Active, false, MIN_BET, [newCard2, oldCard2])

  player.chipCount = calculateChipCount(MIN_BET, player.chipCount)
  player.hands = [newHand1, newHand2]
}

export function doubleDown (player, hand) {
  let cards = hand.cards
  let bet = MIN_BET

  if (cards.length > 2)                   return log('More than 2 cards')
  if (!player)                            return log('no owner for hand')
  if (hand.status !== HAND_STATUS.Active) return log('Not active')

  player.chipCount = calculateChipCount(bet, player.chipCount) 
  hand.bet += bet
  hand.doubleDown = true
}
