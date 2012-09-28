var int = function(n) { return n | 0; }
var hex = function(n) {
  // this if statement prevents "signed hex printout"
  if(n < 0) {
    n += 0xffffffff + 1;
  }
  return n.toString(16);
}

var nbits = function(n) { 
  assert(n < 56, "nbits 56-bit bounds check")
  return (1 << n) - 1;
}

var inspect = function(obj) {
  for(var key in obj) {
    console.log("\""+key + "\" : \"" + obj[key] + "\"")
  }
}

