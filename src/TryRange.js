//
// TryCatchInfo
//
// class CatchBlock
//   Has a list of types and an offset for the code to handle each type
//
// class TryRange
//   Describes a range of code covered in a try block
//
// Dependencies: util.js
//

//
// class CatchBlock
//
var CatchBlock = function(_types, _addr, _catchAll) {
  this._types = _types;
  this._addr = _addr;
  this._catchAll = _catchAll;
};

//
// Returns the address to handle the given type, if present, or -1
//
CatchBlock.prototype.findAddressForType = function(_thrownType) {
  var _i;
  for(_i=0; _i<this._types.length; _i++) {
    if(_thrownType.isEquals(this._types[_i])) {
      return this._addr[_i];
    }
  }

  if(!isUndefined(this._catchAll)) {
    return this._catchAll;
  }

  return -1;
};

CatchBlock.prototype.toStr = function() {
  var _i;
  var s = "";
  for (_i=0; _i<this._types.length; _i++) {
    s += "catch("+this._types[_i].toStr()+") { goto " + this._addr[_i] + "} ";
  }
  return s;
};


//
// class TryRange
//
var TryRange = function(_startAddr, _endAddr, _catchBlock) {
  this._startAddr = _startAddr;
  this._endAddr = _endAddr;
  this._catchBlock = _catchBlock;
};

//
// Returns true if this try block covers the given address
//
TryRange.prototype.coversAddress = function(_pc) {
  return _pc >= this._startAddr && _pc < this._endAddr;
};

//
// Returns the address to handle the given type, if present, or -1
//
TryRange.prototype.findAddressForType = function(_pc, _thrownType) {
  if(!this.coversAddress(_pc)) {
    return -1;
  }

  return this._catchBlock.findAddressForType(_thrownType);
};

TryRange.prototype.toStr = function() {
  return "try ["+ this._startAddr + "," + this._endAddr  + "] :" + this._catchBlock.toStr();
};


