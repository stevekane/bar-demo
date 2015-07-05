'use strict'

import Entity from './Entity'
import {contains, remove, findWhere} from './utils/array'

export default class Store {
  constructor () {
    this.root = new Entity('root')
    this.entities = []
  }

  getById (id) {
    return findWhere('id', id, this.entities) 
  }

  first (predFn) {
    return find(predFn, this.entities)
  }

  firstChild (predFn, entity) {
    for (var i = 0; i < entity.childIds.length; i++) {
      let child = this.getById(entity.childIds[i])
      if (predFn(child)) return child
    }
    return null
  }

  where (predFn) {
    let self = this
    let query = {}

    query[Symbol.iterator] = function () {
      return {
        index: -1,
        next () {
          while ( ++this.index < self.entities.length ) {
            let ent = self.entities[this.index]
            
            if (predFn(ent)) return {done: false, value: ent} 
          }
          return {done: true}
        } 
      }
    }
    return query
  }

  childrenWhere (predFn, entity) {
    let self = this
    let query = {}

    query[Symbol.iterator] = function () {
      return {
        index: -1,
        next () {
          while ( ++this.index < entity.childIds.length ) {
            let childId = entity.childIds[this.index]
            let child = self.getById(childId)
            
            if (predFn(child)) return {done: false, value: child} 
          }
          return {done: true}
        } 
      }
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
