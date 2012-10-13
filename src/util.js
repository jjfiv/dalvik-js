//
// Random javascript utilities: util.js
//

var abs = function(n) {
  if(n < 0) {
    return -n;
  }
  return n;
};
assert(abs(-5) === abs(5), "Simple abs() test");


var max = function(a, b) {
  return (a < b) ? b : a;
};

var min = function(a, b) {
  return (a < b) ? a : b;
};

assert(min(7,10) === 7, "min test");
assert(max(7,10) === 10, "max test");


var isUndefined = function(_obj) {
  return typeof(_obj) === 'undefined';
};

var isObject = function(_obj) {
  return _obj instanceof Object;
};

var isArray = function(_obj) {
  return _obj instanceof Array;
};

var inspect = function(obj) {
  var key, value, text, i;

  text = "";

  if(isArray(obj)) {
    text += '[';
    obj.map(function(item) { text += inspect(item) + ', '; });
    text += ']';

    return text;
  }

  if(!isObject(obj)) {
    return obj.toString();
  }

  text = "{";

  for(key in obj) {
    if(obj.hasOwnProperty(key)) {
      value = obj[key];

      text += "\""+key + "\" :";

      if(typeof(value) === 'object') {
        text += inspect(value);
      } else {
        text += "\"" + obj[key] + "\"";
      }

      text += ", ";
    }
  }
  text += "}";

  return text;
};

var enumerate = function(_name, _array) {
  if(!isArray(_array)) {
    return _name + " = " + inspect(_array);
  }

  var _text = "";
  var _i;
  for(_i = 0; _i<_array.length; _i++) {
    _text += _name + "[" + _i + "] = " + inspect(_array[_i]) + '\n';
  }

  return _text;
};

// 
// A small function to set a lot of values in an array to the same value
// Start and End here are inclusive.
// This is a side-effect function; the array passed in is modified.
//
var setArrayRange = function(_array, _start, _end, _value) {
  var _i;
  for(_i=_start; _i<=_end; _i++) {
    _array[_i] = _value;
  }
};

