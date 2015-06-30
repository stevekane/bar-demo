import {Server} from 'http'
import {pp, log} from 'pretty-log-2'
import {v4} from 'node-uuid'
import SocketServer from 'socket.io'
import servStatic from 'serve-static'
import finalHandler from 'finalHandler'
import Clock from './src/Clock'
import Engine from './src/Engine'
import Enum from './src/Enum'

const {min, max, floor, random} = Math

const handleRequest = (req, res) => server(req, res, finalHander(req, res))
const httpServer = Server(handleRequest)
const io = SocketServer(httpServer)
const engine = new Engine(new Clock, io)

const MIN_BET = 500
const STATUS = new Enum('Active', 'Standing', 'Busted', 'BlackJack')
const SUITS = new Enum('Diamonds', 'Hearts', 'Spades', 'Clubs')
const CARDS = new Enum('Ace', 'Two', 'Three', 'Four', 'Five',
                       'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack',
                       'Queen', 'King')
const CARD_VALUES = [
  [1, 11], [2], [3], [4], [5], [6], [7], [8], [9],
  [10], [10], [10], [10]
]

function randFrom (obj) {
  var keys = Object.keys(obj)
  var index = floor(random() * keys.length)

  return obj[keys[index]]
}

function lowest (ar) {
  var val

  for (var i = 0; i < ar.length; i++) {
    val = !val || ar[i] < val ? ar[i] : val
  }

  return val
}

function highest (ar) {
  var val

  for (var i = 0; i < ar.length; i++) {
    val = !val || ar[i] > val ? ar[i] : val
  }

  return val
}

function contains (array, obj) {
  return array.indexOf(obj) > -1
}

function findWhere (prop, value, array) {
  let i = -1

  while (++i < array.length) {
    if (array[i][prop] === value) return array[i]
  }
  return null
}

function remove (array, obj) {
  array.splice(array.indexOf(obj), 1)
}

//TODO: maybe make this use the magical arguments object?
function addLists (list1, list2) {
  var results = []

  for (var i = 0; i < list1.length; i++) {
    for (var j = 0; j < list2.length; j++) {
      results.push(list1[i] + list2[j]) 
    } 
  }
  return results
}

class Store {
  constructor () {
    this.root = new Entity('root')
    this.entities = []
  }

  getByType (Ctor) {
    var query = []
    var ent 

    for (var i = 0; i < this.entities.length; i++) {
      ent = this.entities[i]
      if (ent instanceof Ctor) query.push(ent)
    }
    return query
  }
  
  getById (id) {
    return findWhere('id', id, this.entities) 
  }

  getChildByType (entity, Ctor) {
    var child 

    for (var i = 0; i < entity.childIds.length; i++) {
      child = this.getById(entity.childIds[i])
      if (child instanceof Ctor) return child
    }
    return null
  }

  getChildrenByType (entity, Ctor) {
    var query = []
    var child 

    for (var i = 0; i < entity.childIds.length; i++) {
      child = this.getById(entity.childIds[i])
      if (child instanceof Ctor) query.push(child)
    }
    return query
  }

  remove (entity) {
    let parentEntity = this.getById(entity.parentId)
    let ent

    while (entity.childIds.length > 0) {
      this.remove(this.getById(entity.childIds[0])) 
    }

    if (parentEntity)                    remove(parentEntity.childIds, entity.id)
    if (contains(this.entities, entity)) remove(this.entities, entity)
    entity.parentId = null
    return this
  }

  attach (targetEntity, entity) {
    let oldParent = this.getById(entity.parentId)

    if (!contains(this.entities, entity)) this.entities.push(entity) 
    if (oldParent)                        remove(oldParent.childIds, entity.id)

    entity.parentId = targetEntity.id
    targetEntity.childIds.push(entity.id)
    return this
  }
}

class Entity {
  constructor (type) {
    this.id = v4()
    this.type = type
    this.parentId = null
    this.childIds = []
  }
}

class Card extends Entity {
  constructor (suit, name) {
    super('Card')  
    this.suit = suit
    this.name = name
  }

  static Random () {
    return new Card(randFrom(SUITS), randFrom(CARDS)) 
  }
}

class Hand extends Entity {
  constructor (betValue, status, doubledDown=false) {
    super('Hand')
    this.betValue = betValue
    this.status = status
    this.doubledDown = doubledDown
  }
}

class Player extends Entity {
  constructor (chipCount) {
    super('Player')
    this.chipCount = chipCount
  }
}

class Dealer extends Entity {
  constructor () {
    super('Dealer')
  }
}

class BlackJackTable extends Store {
  constructor () {
    super()
    this.attach(this.root, new Dealer)
  }
}

function calculateChipCount (bet, chipCount) {
  return max(chipCount - bet, 0)
}

function calculateValues (cards) {
  var values = CARD_VALUES[cards[0].name]

  for (var i = 1; i < cards.length; i++) {
    values = addLists(values, CARD_VALUES[cards[i].name])
  }
  return values
}

function cleanupPlayer (store, player) {
  let hands = store.getChildrenByType(player, Hand)
  let totalHands = hands.length
  let i = -1

  while (++i < totalHands) store.remove(hands[i])
}

function cleanupRound (store) {
  let dealer = store.getChildByType(store.root, Dealer)
  let players = store.getChildrenByType(store.root, Player)

  cleanupPlayer(store, dealer)
  for (var i = 0; i < players.length; i++) {
    cleanupPlayer(store, players[i])
  }
}

function dealPlayer (store, betValue, player) {
  let newHand = new Hand(betValue, STATUS.Active)
  let card1 = new Card.Random
  let card2 = new Card.Random

  player.chipCount = calculateChipCount(MIN_BET, player.chipCount)
  store.attach(player, newHand)
  store.attach(newHand, card1)
  store.attach(newHand, card2)
}

function dealRound (store) {
  let dealer = store.getChildByType(store.root, Dealer)
  let players = store.getChildrenByType(store.root, Player)
  
  dealPlayer(store, 0, dealer)
  for (var i = 0; i < players.length; i++) {
    dealPlayer(store, MIN_BET, players[i])
  }
}

function stand (store, hand) {
  if (hand.status !== STATUS.Active) return

  hand.status = STATUS.Standing
}

function hit (store, hand) {
  if (hand.status !== STATUS.Active) return log('Not active')

  let cards, values

  store.attach(hand, new Card.Random)
  cards = store.getChildrenByType(hand, Card)
  values = calculateValues(cards)  

  if (lowest(values) > 21)       hand.status = STATUS.Busted
  else if (contains(values, 21)) hand.status = STATUS.BlackJack
  else                           hand.status = hand.status
}

function split (store, hand) {
  let owner = store.getById(hand.parentId)
  let cards = store.getChildrenByType(hand, Card)
  let newHand = new Hand(MIN_BET, STATUS.Active)

  if (cards.length > 2)                return log('More than 2 cards')
  if (cards[0].name !== cards[1].name) return log('Not same value!')
  if (hand.status !== STATUS.Active)   return log('Not active')
  if (!owner)                          return log('no owner for hand')
  
  owner.chipCount = calculateChipCount(MIN_BET, owner.chipCount)
  store.attach(owner, newHand)
  store.attach(newHand, cards[1])
  hit(store, hand)
  hit(store, newHand)
}

function doubleDown (store, hand) {
  let owner = store.getById(hand.parentId)
  let cards = store.getChildrenByType(hand, Card)

  if (cards.length > 2)              return log('More than 2 cards')
  if (!owner)                        return log('no owner for hand')
  if (hand.status !== STATUS.Active) return log('Not active')
  
  owner.chipCount = calculateChipCount(MIN_BET, owner.chipCount)
  hand.betValue *= 2
  hand.doubledDown = true
  hit(store, hand)
}

let table = new BlackJackTable
let player1 = new Player(5000)
let player2 = new Player(5000)

table.attach(table.root, player1)
table.attach(table.root, player2)

dealRound(table)

let targetHand = table.getChildByType(player1, Hand)
hit(table, targetHand)
hit(table, targetHand)
hit(table, targetHand)
hit(table, targetHand)

pp(table.getChildrenByType(targetHand, Card))
//split(table, table.getChildByType(player1, Hand))
//doubleDown(table, table.getChildByType(player2, Hand))
//pp(table)
cleanupRound(table)
//pp(table)
