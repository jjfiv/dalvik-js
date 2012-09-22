
var assert = function(cond) { if (!cond) { console.log("Assert fail!"); } }
var int = function(n) { return n | 0; }
var hex = function(n) {
  if(n < 0) {
    n += 0xffffffff + 1;
  }
  return n.toString(16);
}

// pretending there are types
var u32 = function(n) { return (n & 0xffffffff); }
var u16 = function(n) { return (n & 0xffff); }
var u8 = function(n) { return (n & 0xff); }

var nbits = function(n) { return (1 << n) - 1; }

// this is a closure that yields each item of an array as it is called; sorry
var arr2stream = function(arr) {
  var i = 0;
  var len = arr.length;

  return function() {
    return arr[i++];
  }
}


