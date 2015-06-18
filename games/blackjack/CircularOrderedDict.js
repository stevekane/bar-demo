'use strict'

module.exports = CircularOrderedDict

function CircularOrderedDict () {
  this.keys = []
  this.values = []
}

CircularOrderedDict.prototype.append = function (key, value) {
  this.keys.push(key)
  this.values.push(value)
}

CircularOrderedDict.prototype.get = function (key) {
  return this.values[this.keys.indexOf(key)]
}

CircularOrderedDict.prototype.set = function (key, value) {
  this.values[this.keys.indexOf(key)] = value
}

CircularOrderedDict.prototype.first = function () {
  return this.values[0]
}

CircularOrderedDict.prototype.last = function () {
  return this.values[this.values.length - 1]
}

CircularOrderedDict.prototype.firstKey = function () {
  return this.keys[0]
}

CircularOrderedDict.prototype.lastKey = function () {
  return this.keys[this.keys.length - 1]
}

CircularOrderedDict.prototype.previous = function (key) {
  var possibleIndex = this.keys.indexOf(key) + -1 
  var nextIndex = this.keys[possibleIndex] ? possibleIndex : this.keys.length - 1

  return this.values[nextIndex] 
}

CircularOrderedDict.prototype.next = function (key) {
  var possibleIndex = this.keys.indexOf(key) + 1
  var nextIndex = this.keys[possibleIndex] ? possibleIndex : 0

  return this.values[nextIndex] 
}

CircularOrderedDict.prototype.nextKey = function (key) {
  var possibleIndex = this.keys.indexOf(key) + 1
  var nextIndex = this.keys[possibleIndex] ? possibleIndex : 0

  return this.keys[nextIndex] 
}

CircularOrderedDict.prototype.previousKey = function (key) {
  var possibleIndex = this.keys.indexOf(key) - 1
  var nextIndex = this.keys[possibleIndex] ? possibleIndex : this.keys.length - 1

  return this.keys[nextIndex] 
}
