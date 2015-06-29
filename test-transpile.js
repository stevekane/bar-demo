import {Server} from 'http'
import {pp, log} from 'pretty-log-2'
import {v4} from 'node-uuid'
import SocketServer from 'socket.io'
import servStatic from 'serve-static'
import finalHandler from 'finalHandler'
import Clock from './src/Clock'
import Engine from './src/Engine'
import Enum from './src/Enum'

const {min, max} = Math

const handleRequest = (req, res) => server(req, res, finalHander(req, res))
const httpServer = Server(handleRequest)
const io = SocketServer(httpServer)
const engine = new Engine(new Clock, io)

const MIN_BET = 500
const STATUS = new Enum('Active', 'Standing', 'Busted')
const SUITS = new Enum('Diamonds', 'Hearts', 'Spades', 'Clubs')
const CARDS = new Enum('Ace', 'One', 'Two', 'Three', 'Four', 'Five',
                       'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack',
                       'Queen', 'King')

function randFrom (obj) {
  var keys = Object.keys(obj)
  var index = Math.floor(Math.random() * keys.length)

  return obj[keys[index]]
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

class Store {
  constructor () {
    this.root = new Entity('root')
    this.entities = []
  }

  getById (id) {
    return findWhere('id', id, this.entities) 
  }

  getChildByType (entity, Ctor) {
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

    if (parentEntity) remove(parentEntity.childIds, entity.id)
    if (contains(this.entities, entity)) remove(this.entities, entity)
    entity.parentId = null
    return this
  }

  attach (targetEntity, entity) {
    let oldParent = this.getById(entity.parentId)

    if (!contains(this.entities, entity)) this.entities.push(entity) 
    if (oldParent) remove(oldParent.childIds, entity.id)

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
  constructor () {
    super('Hand')
    this.status = STATUS.Active
  }
}

class Player extends Entity {
  constructor (chipCount) {
    super('Player')
    this.chipCount = chipCount
    this.currentBet = 0
  }
}

class Dealer extends Entity {
  constructor () {
    super('Dealer')
  }
}

function cleanupPlayer (store, player) {
  let hands = store.getChildByType(player, Hand)
  let totalHands = hands.length
  let i = -1

  while (++i < totalHands) {
    store.remove(hands[i])
  }
}

function deal (store, player) {
  let newHand = new Hand
  let card1 = new Card.Random
  let card2 = new Card.Random

  player.status = STATUS.Active
  store.attach(player, newHand)
  store.attach(newHand, card1)
  store.attach(newHand, card2)
}

function bet (store, player) {
  if (player.currentBet > 0) return

  player.currentBet = MIN_BET
  player.chipCount = max(player.chipCount - MIN_BET, 0)
}

function stand (store, hand) {
  if (!(hand instanceof Hand)) return
  if (hand.status !== STATUS.Active) return

  hand.status = STATUS.Standing
}

function hit (store, hand) {
  if (!(hand instanceof Hand)) return
  if (hand.status !== STATUS.Active) return

  store.attach(hand, new Card.Random)
}

//lookup owner of hand
//create new hand with 1 card from previous hand
//add chips for bet on new hand
//hit both hands
function split (store, hand) {
  if (hand.status !== STATUS.Active) return

  let owner = store.getById(hand.parentId)
  let cardToMove = store.getChildByType(hand, Card)[1]
  let newHand = new Hand

  if (!owner) return
  if (!cardToMove) return
  
  store.attach(owner, newHand)
  store.attach(newHand, cardToMove)
  store.attach(hand, new Card.Random)
  store.attach(newHand, new Card.Random)
}

function doubleDown (store, player) {

}

let store = new Store
let dealer = new Dealer
let player = new Player(500)

store.attach(store.root, dealer)
store.attach(store.root, player)

deal(store, player)
split(store, store.getChildByType(player, Hand)[0])
pp(store)
cleanupPlayer(store, player)
pp(store)
