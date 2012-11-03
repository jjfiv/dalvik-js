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

// used by dex2js.py 2.0
var binaryStringToArray = function(strdata) {
  var i;
  var results = [];
  for(i=0; i<strdata.length; i++) {
    results.push(strdata.charCodeAt(i));
  }
  return results;
};

var isUndefined = function(_obj) {
  return typeof(_obj) === 'undefined';
};

var isObject = function(_obj) {
  return _obj instanceof Object;
};

var isArray = function(_obj) {
  return _obj instanceof Array;
};

var isFunction = function(_obj) {
  return typeof(_obj) === 'function';
};

var inspect = function(obj) {
  var key, value, text, i;

  text = "";

  if(obj === null) {
    return '*null*';
  }

  if(isUndefined(obj)) {
    return '*undefined*';
  }

  if(isA(obj, 'Thread')){
    return obj.uid+":"+obj.state;
  }

  if(isArray(obj)) {
    text += '[';
    obj.map(function(item) { text += inspect(item) + ', '; });
    text += ']';

    return text;
  }
  
  if(isFunction(obj.toString) && obj.toString !== Object.prototype.toString) {
    return obj.toString();
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

/* Function Name: floatFromDouble

This function converts a double into a float by chopping off relevant bits.
If the number is too small/big, a (-)Infinity is returned 

Inputs:   A double number
Returns:  A float number */

function floatFromDouble (_number) {
  var _ieee_num_struc = decodeIEEE64 (_number);

  // Checking if exponent field is out of bounds.
  if (_ieee_num_struc.exponent > Math.pow(2, 7)) {
    if (_ieee_num_struc.isNegative) {
      return -Infinity;
    }
    return Infinity;
  }
  // Checking if the number is too small - making it 0 in that case.
  if (_ieee_num_struc.exponent < -Math.pow(2, 7)) {
    return 0;
  }

  // Chopping off the irrelevant portion of the mantissa.
  _ieee_num_struc.mantissa *= Math.pow (2, (23-52));
  _ieee_num_struc.mantissa = parseInt(_ieee_num_struc.mantissa, 10);

  // Reforming the float from the exponent and mantissa.
  var _result = (1 + (_ieee_num_struc.mantissa * Math.pow(2, -23))) * 
               Math.pow (2, _ieee_num_struc.exponent);
  if (_ieee_num_struc.isNegative) {
    _result = -_result;
  }

  /* Print _ieee_num_struc.exponent.toString(), _ieee_num_struc.mantissa, 
  _ieee_num_struc.isNegative and result to debug here. */

  return _result;
} // End function floatFromDouble

assert (floatFromDouble(0) === 0, "floatFromDouble: Zero test");
assert (floatFromDouble(1) === 1, "floatFromDouble: Test for 1");
assert (floatFromDouble(-1) === -1, "floatFromDouble: Test for -1");
assert (!isFinite (floatFromDouble (5e39)), "floatFromDouble: Test for out of bounds");
assert (floatFromDouble(50000000000) !== 50000000000, "floatFromDouble: Check if truncated");

/* This function was taken from blog.coolmuse.com to separate out the 
exponent and mantissa parts of the double precision number, with some
modifications */
function decodeIEEE64 (_value) {

  if ( typeof _value !== "number" ) {
    throw new TypeError( "_value must be a Number" );
  }

  var _result = {
    isNegative : false,
    exponent : 0,
    mantissa : 0
  };

  if ( _value === 0 ) {
    _result.exponent -= 1023;
    return _result;
  }

  // not finite?
  if ( !isFinite( _value ) ) {

    _result.exponent = 2047;

    if ( isNaN( _value ) ) {

      _result.isNegative = false;
      _result.mantissa = 2251799813685248; // QNan

    } else {

      _result.isNegative = _value === -Infinity;
      _result.mantissa = 0;

    }
    _result.exponent -= 1023;

    return _result;
  }

  // negative?
  if ( _value < 0 ) {
    _result.isNegative = true;
    _value = -_value;
  }

  // calculate biased exponent
  var _e = 0;
  if ( _value >= Math.pow( 2, -1022 ) ) {   // not denormalized

    // calulate integer part of binary logarithm
    // http://en.wikipedia.org/wiki/Binary_logarithm
    var _r = _value;
    while ( _r < 1 ) { _e -= 1; _r *= 2; }
    while ( _r >= 2 ) { _e += 1; _r /= 2; }

    _e += 1023;  // add bias
  }
  _result.exponent = _e;

  // calculate mantissa
  if ( _e !== 0 ) {

    var _f = _value / Math.pow( 2, _e - 1023 );
    _result.mantissa = Math.floor( (_f - 1) * Math.pow( 2, 52 ) );

  } else { // denormalized

    _result.mantissa = Math.floor( _value / Math.pow( 2, -1074 ) );

  }
  
  _result.exponent -= 1023;
  return _result;
} /* End function decodeIEEE64. */

/* Function Name: floatFromByteStream

This function converts a bytestream into a float.

Inputs:   A bytestream of format fedcba987
Returns:  A float number - check for NaN and (-)Infinity */

function floatFromByteStream (_string) {
  var _exponent = 0;
  var _mantissa = 1.0;
  var _mantissaPart = 0;
  var _number = 0.0;
  var _ptr = 22;
  var _ptrExt = _ptr;
  var _stream;

  _string = ('0x' + _string);
  _stream = Number (_string);

  _exponent = ((_stream & 0x7fffffff) >> 23) - 127;

  if (_exponent === -127)
  {
    _mantissa = 0.0; // The smallest of them all
    _ptrExt = 23;
  }
  _mantissaPart = (_stream & 0x007fffff); // Eliminating all but mantissa
  for (; _ptr >= 0; _ptr--) {
      if ((_mantissaPart & Math.pow (2, _ptr)) === (Math.pow (2, _ptr))) {
      _mantissa += Math.pow (2, (_ptrExt - 23));
    }
    _ptrExt--;
  }

  if (_exponent === 128) {
    if (_mantissa === 1.0) {
      _number = Infinity; 
    }
    else {
      _number = NaN;
    }
  }
  else {
    _number = _mantissa * Math.pow (2, _exponent);
  }
  
  if ((Number(_string.substring(0,3))) > 7) {
    _number = -_number; // No -0.0 in JS. It will be 0.0 anyway.
  }
  return _number;
}

assert (floatFromByteStream('80000000') === 0.0, "floatFromByteStream: 0");
assert (floatFromByteStream('C0000000') === -2.0, "floatFromByteStream: -2.0");
assert (floatFromByteStream('3F800000') === 1.0, "floatFromByteStream: 1.0");
assert (floatFromByteStream('3FFFFFFF') === 1.9999998807907104, "floatFromByteStream: 1.9999999");
assert (isNaN(floatFromByteStream('FF800008')), "floatFromByteStream: -NaN");
assert (isNaN(floatFromByteStream('7F800008')), "floatFromByteStream: +NaN");
assert (isNaN(floatFromByteStream('7F800008')), "floatFromByteStream: +NaN");
assert (floatFromByteStream('FF800000') === -Infinity, "floatFromByteStream: -Infinity");
assert (floatFromByteStream('7F800000') === Infinity, "floatFromByteStream: +Infinity");
assert (floatFromByteStream('FF700008') === -3.1901488124765664e+38, "floatFromByteStream: Random neg float");

/* Function Name: doubleFromByteStream

This function converts a bytestream into a double.

Inputs:   A bytestream of format fedcba9876543210
Returns:  A double number - check for NaN and (-)Infinity */

function doubleFromByteStream (_string) {
  var _exponent = 0;
  var _mantissa = 1.0;
  var _mantissaPart = new gLong();
  var _number = 0.0;
  var _ptr = 51;
  var _ptrExt = _ptr;
  var _stream;
  var _tempPow = new gLong();

  _string = (_string);
  _stream = Number ('0x' + _string.substring(0, 3));

  _exponent = (_stream & 0x7ff) - 1023;

  if (_exponent === -1023)
  {
    _mantissa = 0.0; // The smallest of them all
    _ptrExt = 52;
  }
  
  _mantissaPart = gLong.fromString(_string.substring(3), 16);
  for (; _ptr >= 0; _ptr--) {
    _tempPow = gLong.fromNumber (Math.pow (2, _ptr));
    if (_tempPow.equals (_mantissaPart.and (_tempPow))) {
      _mantissa += Math.pow (2, (_ptrExt - 52));
    }
    _ptrExt--;
  }

  if (_exponent === 1024) {
    if (_mantissa === 1.0) {
      _number = Infinity;
    }
    else {
      _number = NaN;
    }
  }
  else {
    _number = _mantissa * Math.pow (2, _exponent);
  }
  
  if ((Number('0x' + _string.substring(0,1))) > 7) {
    _number = -_number; // No -0.0 in JS. It will be 0.0 anyway.
  }
  return _number;
}
assert (doubleFromByteStream('80000000000000000') === 0.0, "floatFromByteStream: 0");
assert (doubleFromByteStream('C0000000000000000') === -2.0, "floatFromByteStream: -2.0");
assert (doubleFromByteStream('3FF00000000000000') === 1.0, "floatFromByteStream: 1.0");
assert (doubleFromByteStream('3FFFFFFFFFFFFFFF') === 1.9999999999999998, "floatFromByteStream: 1.9999999");
assert (isNaN(doubleFromByteStream('FFF0000000000001')), "floatFromByteStream: -NaN");
assert (isNaN(doubleFromByteStream('7FF1000000000000')), "floatFromByteStream: +NaN");
assert (doubleFromByteStream('FFF0000000000000') === -Infinity, "floatFromByteStream: -Infinity");
assert (doubleFromByteStream('7FF0000000000000') === Infinity, "floatFromByteStream: +Infinity");
assert (doubleFromByteStream('FF70000839993499') === -7.022293890254943e+305, "floatFromByteStream: Random neg float");

function floatFromInt (_input) {
  var buffer = new ArrayBuffer(4);
  var i32ptr = new Int32Array(buffer);
  i32ptr.set([_input]);
  var fptr = new Float32Array(buffer);
  return fptr[0];
}

function intFromFloat (_input) {
  var buffer = new ArrayBuffer(4);
  var fptr = new Float32Array(buffer);
  fptr.set([_input]);
  var i32ptr = new Int32Array(buffer);
  return i32ptr[0];
}

function doubleFromgLong (_input) {
  var buffer = new ArrayBuffer(8);
  var i32ptr = new Int32Array(buffer);
  i32ptr.set([_input.low_, _input.high_]);
  var dptr = new Float64Array(buffer);
  return dptr[0];
}

function gLongFromDouble (_input) {
  var buffer = new ArrayBuffer(8);
  var dptr = new Float64Array(buffer);
  dptr.set([_input]);
  var i32ptr = new Int32Array(buffer);
  gLongInst = new gLong();
  gLongInst.high_ = i32ptr[1];
  gLongInst.low_ = i32ptr[0];
  return gLongInst;
}

var gensym = function () {
  var _counter = -1;
  return function gensym(_prefix){
      return (_prefix || "")+(_counter+=1);
  };
}();

var repeat = function(thing, n){
  if (n === 1){
    return thing;
  } else if (typeof thing === 'string'){
    return thing+repeat(thing, n-1);
  } else if (isArray(thing)){
    return thing.concat(repeat(thing, n-1));
  } else {
    throw "cannot concat"+thing;
  }
};

// array of array dimensions
// create an n-dimensional array where each dimension is filled out and built
// each subfield must have a type field appropriate to its type

var makeHyperArray = function (_dimensionArray, _type, _defaultVal){
  var _i, _thisDim = _dimensionArray[0];
  if (_thisDim){
    var _restDim = _dimensionArray.slice(1), _subType = new Type(_type.getTypeString().slice(1));
    var _arr =  [];
    for (_i=0;_i<_thisDim;_i++){
      _arr[_i] = makeHyperArray(_restDim, _subType, _defaultVal);
    }
    _arr = _arr.splice(0);
    _arr.type = _type;
    return _arr;
  } else {
    return _defaultVal;
  }
};

