'use strict'

import {instanceOf} from './utils/objects'
import {Card, Hand, Player, Dealer} from './Entities'

export const isHand = instanceOf(Hand)
export const isPlayer = instanceOf(Player)
export const isCard = instanceOf(Card)
export const isDealer = instanceOf(Dealer)
