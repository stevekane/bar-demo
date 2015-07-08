import {Server} from 'http'
import {pp, log} from 'pretty-log-2'
import SocketServer from 'socket.io'
import servStatic from 'serve-static'
import finalHandler from 'finalHandler'
import {doLists, lowest, contains, remove} from './utils/array'
import {instanceOf} from './utils/objects'
import {sum} from './utils/math'
import {Card, Hand, Player, Dealer} from './Entities'
import Clock from './Clock'
import Enum from './Enum'
import Entity from './Entity'
import Store from './Store'

const {max} = Math

const handleRequest = (req, res) => server(req, res, finalHander(req, res))
const httpServer = Server(handleRequest)
const io = SocketServer(httpServer)

const MIN_BET = 500

const Ace = 'Ace'
const One = 'One'
const Two = 'Two'
const Three = 'Three'
const Four = 'Four'
const Five = 'Five'
const Six = 'Six'
const Seven = 'Seven'
const Eight = 'Eight'
const Nine = 'Nine'
const Ten = 'Ten'
const Jack = 'Jack'
const Queen = 'Queen'
const King = 'King'

const Diamonds = 'Diamonds'
const Hearts = 'Hearts'
const Spades = 'Spades'
const Clubs = 'Clubs'

const STATUS = new Enum('Active', 'Standing', 'Busted', 'BlackJack')
const SUITS = [Diamonds, Hearts, Spades, Clubs]
const CARDS = [Ace, Two, Three, Four, Five, Six, Seven,
               Eight, Nine, Ten, Jack, Queen, King]

const CARD_VALUES = new Map([
  [Ace, [1, 11]],
  [Two, [2]],
  [Three, [3]],
  [Four, [4]],
  [Five, [5]],
  [Six, [6]],
  [Seven, [7]],
  [Eight, [8]],
  [Nine, [9]],
  [Ten, [10]],
  [Jack, [10]],
  [Queen, [10]],
  [King, [10]],
])

const isHand = instanceOf(Hand)
const isPlayer = instanceOf(Player)
const isCard = instanceOf(Card)
const isDealer = instanceOf(Dealer)

class BlackJackTable extends Store {
  constructor(dealer) {
    super()
    this.attach(this.root, dealer) 
  }
}

function calculateChipCount (bet, chipCount) {
  return max(chipCount - bet, 0)
}

function calculateValues (cards) {
  var values = CARD_VALUES.get(cards[0].name)

  for (var i = 1; i < cards.length; i++) {
    values = doLists(sum, values, CARD_VALUES.get(cards[i].name))
  }
  return values
}

function cleanupPlayer (store, player) {
  let hands = store.childrenWhere(isHand, player)

  for (let hand of hands) store.remove(hand)
}

function cleanupRound (store) {
  let dealer = store.firstChild(isDealer, store.root)
  let players = store.childrenWhere(isPlayer, store.root)

  cleanupPlayer(store, dealer)
  for (let player of players) cleanupPlayer(store, player)
}

function dealPlayer (store, betValue, player) {
  let newHand = new Hand(betValue, STATUS.Active)
  let card1 = new Card.Random(SUITS, CARDS)
  let card2 = new Card.Random(SUITS, CARDS)

  player.chipCount = calculateChipCount(MIN_BET, player.chipCount)
  store.attach(player, newHand)
  store.attach(newHand, card1)
  store.attach(newHand, card2)
}

function dealRound (store) {
  let dealer = store.firstChild(isDealer, store.root)
  let players = store.childrenWhere(isPlayer, store.root)
  
  dealPlayer(store, 0, dealer)
  for (let player of players) dealPlayer(store, MIN_BET, player)
}

function stand (store, hand) {
  hand.status = hand.status !== STATUS.Active ? hand.status : STATUS.Standing
}

function hit (store, hand) {
  if (hand.status !== STATUS.Active) return log('Not active')

  store.attach(hand, new Card.Random(SUITS, CARDS))

  let cards = [...store.childrenWhere(isCard, hand)]
  let values = calculateValues(cards)  

  if      (lowest(values) > 21)  hand.status = STATUS.Busted
  else if (contains(values, 21)) hand.status = STATUS.BlackJack
  else                           hand.status = hand.status
}

function split (store, hand) {
  let owner = store.getById(hand.parentId)
  let cards = [...store.childrenWhere(isCard, hand)]
  let newHand = new Hand(MIN_BET, STATUS.Active)

  if (cards.length > 2)                return log('More than 2 cards')
  if (cards[0].name !== cards[1].name) return log('Not same value!')
  if (hand.status !== STATUS.Active)   return log('Not active')
  if (!owner)                          return log('no owner for hand')
  
  store.attach(owner, newHand)
  store.attach(newHand, cards[1])
  owner.chipCount = calculateChipCount(MIN_BET, owner.chipCount)
  hit(store, hand)
  hit(store, newHand)
}

function doubleDown (store, hand) {
  let owner = store.getById(hand.parentId)
  let cards = [...store.childrenWhere(isCard, hand)]

  if (cards.length > 2)              return log('More than 2 cards')
  if (!owner)                        return log('no owner for hand')
  if (hand.status !== STATUS.Active) return log('Not active')
  
  owner.chipCount = calculateChipCount(MIN_BET, owner.chipCount)
  hand.betValue *= 2
  hand.doubledDown = true
  hit(store, hand)
}

let table = new BlackJackTable(new Dealer)
let player1 = new Player(5000)
let player2 = new Player(5000)

table.attach(table.root, player1)
table.attach(table.root, player2)

dealRound(table)

let targetHand = table.firstChild(isHand, player1)

hit(table, targetHand)
hit(table, targetHand)
hit(table, targetHand)

split(table, table.firstChild(isHand, player1))
doubleDown(table, table.firstChild(isHand, player2))
pp(table)
cleanupRound(table)
pp(table)
