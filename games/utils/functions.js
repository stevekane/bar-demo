'use strict'

module.exports.pluck = pluck
module.exports.addLists = addLists
module.exports.shuffle = shuffle
module.exports.lowest = lowest
module.exports.highest = highest
module.exports.surround = surround
module.exports.remove = remove
module.exports.append = append
module.exports.randFrom = randFrom

function pluck (attrName) {
  return function innerPluck (obj) {
    return obj[attrName] 
  }
}

function addLists (list1, list2) {
  var results = []

  for (var i = 0; i < list1.length; i++) {
    for (var j = 0; j < list2.length; j++) {
      results.push(list1[i] + list2[j]) 
    } 
  }
  return results
}

function shuffle (o) {
  for(var j, x, i = o.length; 
      i; 
      j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o; 
}

function lowest (ar) {
  var val

  for (var i = 0; i < ar.length; i++) {
    val = !val || ar[i] < val ? ar[i] : val
  }

  return val
}

function highest (ar) {
  var val

  for (var i = 0; i < ar.length; i++) {
    val = !val || ar[i] > val ? ar[i] : val
  }

  return val
}

function surround (str, left, right) {
  return left + str + right
}

function remove (array, obj) {
  array.splice(array.indexOf(obj), 1)
}

function append (array1, array2) {
  for (var i = 0; i < array2.length; i++) {
    array1.push(array2[i]) 
  }
  return array1
}

function randFrom (array) {
  return array[Math.floor(Math.random() * array.length)]
}
