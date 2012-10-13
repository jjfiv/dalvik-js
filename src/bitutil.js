//
// Bitwise utilties: bitutil.js
//


var nbits = function(n) {
  assert(n < 32, "nbits 32-bit bounds check");
  if(n === 32) { 
    return -1;
  }
  return (1 << n) - 1;
};

var signExtend = function(_value, _originalLength, _finalLength) {
  if(_originalLength === 0) {
    return 0;
  }
  var mask = 0;

  assert(_originalLength >= 1, "signExtend: Original Length >= 1");
  assert(_finalLength >= _originalLength, "signExtend: Final Length >= originalLength");
  assert(_finalLength <= 32, "Only handle 32 bits");

  // use _originalLength to determine sign bit
  if ( ((1 << (_originalLength-1)) & _value) !== 0) {
    // create a mask for new sign bits if set
    mask = nbits(_finalLength - _originalLength) << _originalLength;
  }

  // construct new int
  return _value | mask;
};

assert(signExtend(0xff, 8, 16) === 0xffff, "Sign extend 8-16 fs");
assert(signExtend(0xff, 8, 16) !== -1, "Sign extend 8-16 not -1");
assert(signExtend(0x7f, 8, 16) === 0x007f, "Sign extend 8-16 no need");
assert(signExtend(0xff, 8, 32) === -1, "Sign extend 32");

var hex = function(n) {
  // this if statement prevents "signed hex printout"
  if(n < 0) {
    n += 0xffffffff + 1;
  }
  return n.toString(16);
};
assert(hex(0xdeadbeef) === 'deadbeef', "hex test");

//
// A nibble is four bits; return the high four bits of a byte
//
var highNibble = function(x, n) {
  return (x & 0xf0) >> 4;
};

//
// A nibble is four bits; return the low four bits of a byte
//
var lowNibble = function(x, n) {
  return (x & 0xf);
};

