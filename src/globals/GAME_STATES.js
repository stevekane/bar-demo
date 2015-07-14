'use strict'

import Enum from '../Enum'

const GAME_STATES = new Enum(
  'Waiting',
  'Betting',
  'Acting',
  'Scoring'
)

export default GAME_STATES
