'use strict'

import Entity from './Entity'
import {contains, remove, find, findWhere} from './utils/array'

export default class Store {
  constructor() {
    this.root = new Entity('root')
    this.entities = []
  } 

  *where (predFn) {
    let store = this
    let entities = store.entities
    let index = -1 

    while ( ++index < entities.length ){
      let ent = entities[index]

      if (predFn(ent)) yield ent
    }
  }

  *childrenWhere (predFn, entity) {
    let store = this
    let index = -1

    while ( ++index < entity.childIds.length ) {
      let childId = entity.childIds[index]
      let child = store.getById(childId)
      
      if (predFn(child)) yield child
    }
  }

  getById (id) {
    let store = this

    return findWhere('id', id, store.entities) 
  }

  first (predFn) {
    let store = this

    return find(predFn, store.entities)
  }

  firstChild (predFn, entity) {
    let store = this

    for (var i = 0; i < entity.childIds.length; i++) {
      let child = store.getById(entity.childIds[i])

      if (predFn(child)) return child
    }
    return null
  }

  remove (entity) {
    let store = this
    let parentEntity = store.getById(entity.parentId)

    while (entity.childIds.length > 0) {
      store.remove(store.getById(entity.childIds[0])) 
    }

    if (parentEntity)                     remove(parentEntity.childIds, entity.id)
    if (contains(store.entities, entity)) remove(store.entities, entity)
    entity.parentId = null
  }

  attach (targetEntity, entity) {
    let store = this
    let oldParent = store.getById(entity.parentId)

    if (!contains(store.entities, entity)) store.entities.push(entity) 
    if (oldParent)                         remove(oldParent.childIds, entity.id)

    entity.parentId = targetEntity.id
    targetEntity.childIds.push(entity.id)
  }
}
