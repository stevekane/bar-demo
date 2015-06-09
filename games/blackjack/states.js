'use strict'

var State = require('./State')
var transactions = require('./transactions')
var dealRound = transactions.dealRound
var collectRound = transactions.collectRound

module.exports.BetCollecting = BetCollecting
module.exports.CardDealing = CardDealing
module.exports.Action = Action
module.exports.PostRound = PostRound
module.exports.CardCollecting = CardCollecting

var BET_DURATION = 1000
var DEAL_DURATION = 2000
var ACTION_DURATION = 5000
var POST_DURATION = 3000
var COLLECTION_DURATION = 2000

function BetCollecting (game) {
  State.Timed.call(this, game, 'Collecting Bets', BET_DURATION)
}

function CardDealing (game) {
  State.Timed.call(this, game, 'Dealing Cards', DEAL_DURATION)

  this.enter = function () {
    dealRound(this.game.shoe, this.game.players, this.game.dealer)
  }
}

function Action (game) {
  State.Timed.call(this, game, 'Taking Action', ACTION_DURATION)
}

function PostRound (game) {
  State.Timed.call(this, game, 'Finishing Round', POST_DURATION)
}

function CardCollecting (game) {
  State.Timed.call(this, game, 'Collecting Cards', COLLECTION_DURATION)

  this.enter = function () {
    collectRound(this.game.shoe, this.game.players, this.game.dealer)
  }
}
