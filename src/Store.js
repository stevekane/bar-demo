'use strict'

import Entity from './Entity'
import {contains, remove, findWhere} from './utils/array'

export default class Store {
  constructor () {
    this.root = new Entity('root')
    this.entities = []
    this.where = function*(predFn) {
      let entities = this.entities
      let index = -1 

      while ( ++index < entities.length ){
        let ent = entities[index]

        if (predFn(ent)) yield ent
      }
    }
    this.childrenWhere = function*(predFn, entity) {
      let self = this
      let index = -1

      while ( ++index < entity.childIds.length ) {
        let childId = entity.childIds[index]
        let child = self.getById(childId)
        
        if (predFn(child)) yield child
      }
    }
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

  remove (entity) {
    let parentEntity = this.getById(entity.parentId)

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
