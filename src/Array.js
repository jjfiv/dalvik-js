// Array.js
// dependencies:
var newArray = function (_dest, _sizeReg, _type) {
  this._dest = _dest;
  this._sizeReg = _sizeReg;
  this.type = _type;
  this._data = [];
};

var newDimArray = function (_inst, _thread) {
  this._dimensions = _inst.dimensions;
  this._sizes = _inst.sizes;
  this._type = _inst.type;
  this._data = genArray (this._sizes);
};

// This function adopted from Stack Overflow
var genArray = function (args) {
  var arr, len, i;
  if(!isArray(args)) {
    arr = new Array (args);
  }
  else if(args.length > 0) {
    len = [].slice.call(args, 0, 1)[0];
    arr = new Array(len);
    for(i = 0; i < len; i++) {
      arr[i] = genArray([].slice.call(args, 1));
    }
  } else {
    return null; //or whatever you want to initialize values to.
  }
  return arr;
};
