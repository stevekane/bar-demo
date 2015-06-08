'use strict'

var State = require('./State')

module.exports.BetCollecting = BetCollecting
module.exports.CardDealing = CardDealing
module.exports.Action = Action
module.exports.PostRound = PostRound

var BET_DURATION = 1000
var DEAL_DURATION = 2000
var ACTION_DURATION = 15000
var POST_DURATION = 3000

function BetCollecting (game) {
  State.Timed.call(this, game, 'Collecting Bets', BET_DURATION)
}

function CardDealing (game) {
  State.Timed.call(this, game, 'Dealing Cards', DEAL_DURATION)
}

function Action (game) {
  State.Timed.call(this, game, 'Taking Action', ACTION_DURATION)
}

function PostRound (game) {
  State.Timed.call(this, game, 'Finishing Round', POST_DURATION)
}
