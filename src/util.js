'use strict'

var int = function(n) { return n | 0; }
var hex = function(n) {
  // this if statement prevents "signed hex printout"
  if(n < 0) {
    n += 0xffffffff + 1;
  }
  return n.toString(16);
}

var abs = function(n) {
  if(n < 0) {
    return -n;
  }
  return n;
}

var nbits = function(n) { 
  assert(n < 56, "nbits 56-bit bounds check")
  return (1 << n) - 1;
}

var isObject = function(_obj) {
  return _obj instanceof Object;
}

var isArray = function(_obj) {
  return _obj instanceof Array
}

var inspect = function(obj) {
  var key, value, text, i;

  text = ""

  if(isArray(obj)) {
    text += '['
    obj.map(function(item) { text += inspect(item) + ', ' })
    text += ']'

    return text
  }
  
  if(!isObject(obj)) {
    return obj.toString()
  }
  

  var text = "{"
  
  for(key in obj) {
    value = obj[key]

    text += "\""+key + "\" :"

    if(typeof(value) === 'object') {
      text += inspect(value)
    } else {
      text += "\"" + obj[key] + "\""
    }

    text += ", "
  }
  text += "}"

  return text
}

var isUndefined = function(_obj) {
  return typeof(_obj) === 'undefined';
}

