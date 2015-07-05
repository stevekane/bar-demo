'use strict'

import {v4} from 'node-uuid'

export default class Entity {
  constructor (type) {
    this.id = v4()
    this.type = type
    this.parentId = null
    this.childIds = []
  }
}

