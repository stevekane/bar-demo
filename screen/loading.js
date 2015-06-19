'use strict'

module.exports.loadJSON = loadJSON
module.exports.loadImage = loadImage
module.exports.loadScript = loadScript

function loadJSON (path) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest 

    xhr.responseType = 'text'
    xhr.onload = function () { resolve(JSON.parse(xhr.responseText)) }
    xhr.onerror = function (e) { reject(e) }
    xhr.open('GET', path, true)
    xhr.send(null)
  })
}

function loadImage (path) {
  return new Promise(function (resolve, reject) {
    var img = new Image

    img.src = path
    img.onload = function () { resolve(img) }
    img.onerror = function (e) { reject(e) }
  })
}

function loadScript (path) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest 

    xhr.responseType = 'text'
    xhr.onload = function () { 
      console.log('loaded')
      resolve(xhr.responseText) 
    }
    xhr.onerror = function (e) { 
      console.log('reject')
      reject(e) 
    }
    xhr.open('GET', path, true)
    xhr.setRequestHeader('Acces-Control-Allow-Origin', '*')
    xhr.setRequestHeader('Content-Type', 'text/javascript')
    xhr.send(null)
  })
}
