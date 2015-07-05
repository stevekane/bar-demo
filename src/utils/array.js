'use strict'

const {min, max} = Math

export {doLists, lowest, highest, findWhere, contains, remove}

//monadic list operation
function doLists (fn, list1, list2) {
  var results = []

  for (var i = 0; i < list1.length; i++) {
    for (var j = 0; j < list2.length; j++) {
      results.push(fn(list1[i], list2[j]))
    } 
  }
  return results
}

function lowest (array) {
  let val = Infinity

  for (let item of array) val = min(val, item)
  return val
}

function highest (array) {
  let val = 0

  for (let val of array) val = max(val, item)
  return val
}

function contains (array, obj) {
  return array.indexOf(obj) > -1
}

function find (predFn, array) {
  for (let item of array) if (predFn(item)) return item
  return null
}

function findWhere (prop, value, array) {
  for (let item of array) if (item[prop] === value) return item
  return null
}

function remove (array, obj) {
  array.splice(array.indexOf(obj), 1)
}

