'use strict'

import Signal from '../Signal'

export default class Clock extends Signal {
  constructor () {
    super()
    this.lastTime = Date.now()
    this.thisTime = this.lastTime
    this.dT       = this.thisTime - this.lastTime
  }
  
  tick () {
    this.lastTime = this.thisTime
    this.thisTime = Date.now()
    this.dT       = this.thisTime - this.lastTime
  }
}
