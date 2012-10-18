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
  else if (_ieee_num_struc.exponent < -Math.pow(2, 7)) {
    return 0;
  }

  // Chopping off the irrelevant portion of the mantissa.
  _ieee_num_struc.mantissa *= Math.pow (2, (23-52));
  _ieee_num_struc.mantissa = parseInt(_ieee_num_struc.mantissa);

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

assert (floatFromDouble(0) === 0, "Zero test");
assert (floatFromDouble(1) === 1, "Test for 1");
assert (floatFromDouble(-1) === -1, "Test for -1");
assert (!isFinite (floatFromDouble (5e39)), "Test for out of bounds");
assert (floatFromDouble(50000000000) !== 50000000000, "Check if truncated");

/* This function was taken from blog.coolmuse.com to separate out the 
exponent and mantissa parts of the double precision number, with some
modifications */
function decodeIEEE64 (_value) {

  if ( typeof _value !== "number" )
    throw new TypeError( "_value must be a Number" );

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
  if ( _e != 0 ) {

    var _f = _value / Math.pow( 2, _e - 1023 );
    _result.mantissa = Math.floor( (_f - 1) * Math.pow( 2, 52 ) );

  } else { // denormalized

    _result.mantissa = Math.floor( _value / Math.pow( 2, -1074 ) );

  }
  
  _result.exponent -= 1023;
  return _result;
} /* End function decodeIEEE64. */
