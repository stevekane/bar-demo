#Pretty Log
Tiny modules that provides basic 'log' utility function which handles some basic logic for pretty printing objects in javascript

#API
##log
Log objects purely using the behavior found in console.log

```javascript
var myObject = {
  name: 'Bob',
  age: 5
}

log(myObject)
```

Can also be used without any 'this' context so useful for callbacks
```javascript
promiseFn()
  .then(doMore)
  .catch(log)
```

##pp
'Pretty-print' a javascript object (also accepts primitives) for better readability.

```javascript
var myObject = {
  name: 'Bob',
  age: 5
}

pp(myObject)
```


