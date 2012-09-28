'use strict'

// LEB128 variable byte encoding from DWARF 3 format used in .dex files
var leb128 = function(get_byte, signed) {
  var i;
  var value = 0;
  
  for(i=0; i<5; i++) {
    var cur = get_byte() & 0xff

    // accum
    value |= (cur & 0x7f) << (7*i)

    // exit when highest order bit is 0
    if((cur & 0x80) == 0) {
      // check sign of most recent byte
      var negative = cur & 0x40

      if(negative && signed) {
        var mask = nbits(7*(i+1))
        assert(mask & value === value, "bitwise sanity check")
        value |= ~mask
      }

      return value;
    }
  }

  // TODO do something better here...
  return undefined;
}

// variants of LEB128
var uleb128 = function(fn) { return leb128(fn, false); }
var uleb128p1 = function(fn) { return leb128(fn, false) - 1; }
var sleb128 = function(fn) { return leb128(fn, true); }

// this is a closure that yields each item of an array as it is called; 
// used below for unit testing
var arr2stream = function(arr) {
  var i = 0;
  var len = arr.length;

  return function() {
    return arr[i++];
  }
}

//
// unit testing; examples from
// http://source.android.com/tech/dalvik/dex-format.html 
//
assert(-1 === sleb128(arr2stream([0x7f])), "sleb128 test")
assert(-128 === sleb128(arr2stream([0x80, 0x7f])), "sleb128 test")

assert(127 === uleb128(arr2stream([0x7f])), "uleb128 test")
assert(16256 === uleb128(arr2stream([0x80, 0x7f])), "uleb128 test")

assert(16255 === uleb128p1(arr2stream([0x80, 0x7f])), "uleb128p1 test")
assert(-1 === uleb128p1(arr2stream([0x00])), "uleb128p1 test")


