'use strict'

import Store from './Store'

export default class BlackJackTable extends Store {
  constructor(dealer) {
    super()
    this.attach(this.root, dealer) 
  }
}
