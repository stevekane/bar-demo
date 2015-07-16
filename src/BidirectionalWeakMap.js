'use strict'

export default class BidirectionalWeakmap {
  constructor () {
    this.leftToRight = new WeakMap
    this.rightToLeft = new WeakMap 
  }

  get (left) {
    return this.leftToRight.get(left) 
  }

  getRight (right) {
    return this.rightToLeft.get(right) 
  }

  set (left, right) {
    this.leftToRight.set(left, right)
    this.rightToLeft.set(right, left)
  }

  setRight (right, left) {
    this.leftToRight.set(left, right)
    this.rightToLeft.set(right, left)
  }

  has (left) {
    return this.leftToRight.has(left) 
  }

  hasRight () {
    return this.rightToLeft.has(right) 
  }

  delete (left) {
    let right = this.leftToRight.get(left) 

    this.rightToLeft.delete(right)
    this.leftToRight.delete(left)
  }

  deleteRight (right) {
    let left = this.rightToLeft.get(right) 

    this.leftToRight.delete(left)
    this.rightToLeft.delete(right)
  }
}
