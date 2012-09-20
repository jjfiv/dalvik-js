
var assert = function(cond) { if (!cond) { console.log("Assert fail!"); } }
var int = function(n) { return n | 0; }
var hex = function(n) { return int(n).toString(16); }

// pretending there are types
var u32 = function(n) { return (n & 0xffffffff); }
var u16 = function(n) { return (n & 0xffff); }
var u8 = function(n) { return (n & 0xff); }

var nbits = function(n) { return (1 << n) - 1; }

// Jennie is testing git