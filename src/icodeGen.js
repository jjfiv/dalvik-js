//--- A translator for Dalvik Bytecode into icode
// dependencies : bitutil.js, dexLoader.js, util.js

var NOT_IMPLEMENTED = function(_icode) {
  console.log("The translation of Dalvik '" + _icode.dalvikName + "' to our icode '" + _icode.op + "' is not complete.");
  throw "Not Implemented";
};

// These are helper functions for parsing bytecode arguments
var dest4src4 = function(_dcode, _icode, _dex) {
  var x = _dcode.get();
  _icode.src = highNibble(x);
  _icode.dest = lowNibble(x);
};

var dest8src16 = function(_dcode, _icode, _dex) {
  _icode.dest = _dcode.get();
  _icode.src = _dcode.get16();
};

var dest16src16 = function(_dcode, _icode, _dex) {
  _icode.dest = _dcode.get16();
  _icode.src = _dcode.get16();
};

var dest8field16 =  function(_dcode, _icode, _dex) {
  _icode.dest = _dcode.get();
  _icode.field = _dex.fields[ _dcode.get16() ];
};

var src8field16 =  function(_dcode, _icode, _dex) {
  _icode.src = _dcode.get();
  _icode.field = _dex.fields[ _dcode.get16() ];
};

var dest8src8lit8 = function(_dcode, _icode, _dex) {
  _icode.dest = _dcode.get();
  _icode.src = _dcode.get();
  _icode.literal = signExtend(_dcode.get(), 8, 32);
};

var varA4varB4offset16 = function(_dcode, _icode, _dex) {
//------------------------------------------------------
// Relevant to all binary control-comparators ops:     |
// _icode.varA == register with first operand (4bit)   |
// _icode.varB == register with second operand (4bit)  |
// _icode.addrOffset == offset to next command (16bit) |
//------------------------------------------------------
  var x = _dcode.get();
  _icode.varA = lowNibble(x);
  _icode.varB = highNibble(x);
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
};

var arrayTriplet = function(_dcode, _icode, _dex) {
//------------------------------------------------------
// Relevant to all array ops (get/put):                |
// _icode.value == value to deal with (8bit)           |
// _icode.array == offset to beginning of array (8bit) |
// _icode.index == offset within array (8bit)          |
//------------------------------------------------------
  _icode.value = _dcode.get();
  _icode.array = _dcode.get();
  _icode.index = _dcode.get();
};

var dest8srcA8srcB8 = function(_dcode, _icode, _dex) {
//---------------------------------------------------
// Relevant to binary ops of type c = a + b:        |
// _icode.dest == target register (8bit)            |
// _icode.srcA == register with first value (8bit)  |
// _icode.srcB == register with second value (8bit) |
//---------------------------------------------------
  _icode.dest = _dcode.get();
  _icode.srcB = _dcode.get();
  _icode.srcA = _dcode.get();
};

var destsrcA4srcB4 = function(_dcode, _icode, _dex) {
//---------------------------------------------------
// Relevant to binary ops of type a += b:           |
// Target register is same as source register       |
// _icode.dest == target register (4bit)            |
// _icode.srcA == register with first value (4bit)  |
// _icode.srcB == register with second value (4bit) |
//---------------------------------------------------
  var x = _dcode.get();
  _icode.srcA = highNibble(x);
  _icode.srcB = lowNibble(x);
  _icode.dest = _icode.srcB;
};

var dest4src4lit16 = function(_dcode, _icode, _dex) {
//-----------------------------------------------------
// Relevant to binary ops c = a + b; b is a literal:  |
// _icode.dest == target register (4bit)              |
// _icode.varA == register with first value (4bit)    |
// _icode.varB == register with second value (16bit)  |
//-----------------------------------------------------
  var x = _dcode.get();
  _icode.dest = highNibble(x);
  _icode.src = lowNibble(x);
  _icode.literal = signExtend(_dcode.get16(), 16, 32);
};

var val4obj4field16 = function(_dcode, _icode, _dex) {
//------------------------------------------------
// Relevant to instance gets/puts:               |
// _icode.value == value register address (4bit) |
// _icode.obj == object register address (4bit)  |
// _icode.field == field register (16bit)        |
//------------------------------------------------
  var x = _dcode.get();
  _icode.value = lowNibble(x);
  _icode.obj = highNibble(x);
  _icode.field = _dex.fields[_dcode.get16()];
};

// Dalvik VM opcode names

var opName = []; // a list of dalvik instruction names
var opArgs = []; // parse functions for each dalvik instruction

opName[0x00] = "nop";
opArgs[0x00] = function (_dcode, _icode, _dex) {
  _icode.op = "nop";
  var _payload = _dcode.get();
  
  // just a nop
  if(_payload === 0) { return; }

  // Sometimes, a NOP is just a NOP
  // ...and sometimes, it is a data structure that we've already parsed from another command

  // parse data
  var _size;
  if(_payload === 0x01) {
    // packed-switch payload format
    size = _dcode.get16();
    _dcode.skip(4 + 4*size);
  } else if(_payload === 0x02) {
    // sparse-switch
    size = _dcode.get16();
    _dcode.skip(2*4*size);
  } else if(_payload === 0x03) {
    // fill-array data
    var elementWidth = _dcode.get16();
    var numElements = _dcode.get32();
    _dcode.skip(elementWidth*numElements);
  }
};

//////////////////////////////////////// MOVE COMMANDS ////////////////////////////////////////

opName[0x01] = "move";
opArgs[0x01] = function (_dcode, _icode, _dex) {
  _icode.op = "move";
  dest4src4(_dcode, _icode, _dex);
};

opName[0x02] = "move/from16";
opArgs[0x02] = function (_dcode, _icode, _dex) {
  _icode.op = "move";
  dest8src16(_dcode, _icode, _dex);
};

opName[0x03] = "move/16";
opArgs[0x03] = function (_dcode, _icode, _dex) {
  _icode.op = "move";
  dest16src16(_dcode, _icode, _dex);
};

opName[0x04] = "move-wide";
opArgs[0x04] = function (_dcode, _icode, _dex) {
  _icode.op = "move";
  _icode.wide = true;
  dest4src4(_dcode, _icode, _dex);
};

opName[0x05] = "move-wide/from16";
opArgs[0x05] = function (_dcode, _icode, _dex) {
  _icode.op = "move";
  _icode.wide = true;
  dest8src16(_dcode, _icode, _dex);
};

opName[0x06] = "move-wide/16";
opArgs[0x06] = function(_dcode, _icode, _dex) {
  _icode.op = "move";
  _icode.wide = true;
  dest16src16(_dcode, _icode, _dex);
};

opName[0x07] = "move-object";
opArgs[0x07] = opArgs[0x01]; // this is the same handling as "move"

opName[0x08] = "move-object/from16";
opArgs[0x08] = opArgs[0x02]; // this is the same handling as "move/from16"

opName[0x09] = "move-object/16";
opArgs[0x09] = opArgs[0x03]; // this is the same handling as "move/16"

opName[0x0a] = "move-result";
opArgs[0x0a] = function(_dcode, _icode, _dex) {
  _icode.op = "move-result";
  _icode.dest = _dcode.get();
};

opName[0x0b] = "move-result-wide";
opArgs[0x0b] = function(_dcode, _icode, _dex) {
  _icode.op = "move-result";
  _icode.wide = true;
  _icode.dest = _dcode.get();
};

opName[0x0c] = "move-result-object";
opArgs[0x0c] = opArgs[0x0a]; // this is the same handling as "move-result"

opName[0x0d] = "move-exception";
opArgs[0x0d] = function(_dcode, _icode, _dex) {
  _icode.op = "move-exception";
  _icode.dest = _dcode.get();
};

//////////////////////////////////////// RETURN COMMANDS ////////////////////////////////////////
// var dest8 = 
opName[0x0e] = "return-void";
opArgs[0x0e] = function(_dcode, _icode, _dex) {
  _icode.op = "return";
};

opName[0x0f] = "return";
opArgs[0x0f] = function(_dcode, _icode, _dex) {
  _icode.op = "return";
  _icode.value = _dcode.get();
};

opName[0x10] = "return-wide";
opArgs[0x10] = function(_dcode, _icode, _dex) {
  _icode.op = "return";
  _icode.wide = true;
  _icode.value = _dcode.get();
};

opName[0x11] = "return-object";
opArgs[0x11] = opArgs[0x0f]; // should be the same handling as "return"

//////////////////////////////////////// HANDLING CONSTANTS ////////////////////////////////////////
opName[0x12] = "const/4";
opArgs[0x12] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";  
  var x = _dcode.get();
  _icode.dest = signExtend(lowNibble(x), 4, 32);
  _icode.value = highNibble(x);
};

opName[0x13] = "const/16";
opArgs[0x13] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.value = signExtend(_dcode.get16(), 16, 32);
};

opName[0x14] = "const";
opArgs[0x14] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";  
  _icode.dest = _dcode.get();
  _icode.value = _dcode.get32();
};

opName[0x15] = "const/high16";
opArgs[0x15] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";  
  _icode.dest = _dcode.get();
  _icode.value = _dcode.get16() << 16;
};

opName[0x16] = "const-wide/16";
opArgs[0x16] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.wide = true;
  // ugly hack to sign extend for 64-bit
  // take number as is, shift left to the top of the high part, create 64 bit thing
  // shift all the way right to fill the 64 bit thing
  _icode.value = gLong.fromBits(0, _dcode.get16() << 16).shiftRight(48);
};

opName[0x17] = "const-wide/32";
opArgs[0x17] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.wide = true;
  // see comment in 0x16
  _icode.value = gLong.fromBits(0, _dcode.get32()).shiftRight(32);
};

opName[0x18] = "const-wide";
opArgs[0x18] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.wide = true;
  var low = _dcode.get32();
  var high = _dcode.get32();
  _icode.value = gLong.fromBits(low, high);
};

opName[0x19] = "const-wide/high16";
opArgs[0x19] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.wide = true;
  _icode.value = gLong.fromBits(0, _dcode.get16() << 16);
};

opName[0x1a] = "const-string";
opArgs[0x1a] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.value = _dex.strings[_dcode.get16()];
};

opName[0x1b] = "const-string/jumbo";
opArgs[0x1b] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.value = _dex.strings[_dcode.get32()];
};

opName[0x1c] = "const-class";
opArgs[0x1c] = function(_dcode, _icode, _dex) {
  _icode.op = "move-const";
  _icode.dest = _dcode.get();
  _icode.value = _dex.types[_dcode.get16()];
};

//////////////////////////////////////// HANDLING MONITORS ////////////////////////////////////////
opName[0x1d] = "monitor-enter";
opArgs[0x1d] = function(_dcode, _icode, _dex) {
  _icode.op = "monitor-enter";
  _icode.src = _dcode.get();
};

opName[0x1e] = "monitor-exit";
opArgs[0x1e] = function(_dcode, _icode, _dex) {
  _icode.op = "monitor-exit";
  _icode.src = _dcode.get();
};

//////////////////////////////////////// TYPE SHIZZ ////////////////////////////////////////
opName[0x1f] = "check-cast";
opArgs[0x1f] = function(_dcode, _icode, _dex) {
  _icode.op = "check-cast";
  _icode.src = _dcode.get();
  _icode.type = _dex.types[_dcode.get16()];
};

opName[0x20] = "instance-of";
opArgs[0x20] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-of";
  var x = _dcode.get();
  _icode.dest = highNibble(x);
  _icode.src = lowNibble(x);
  _icode.type = _dex.types[_dcode.get16()];
};

opName[0x21] = "array-length";
opArgs[0x21] = function(_dcode, _icode, _dex) {
  _icode.op = "array-length";
  var x = _dcode.get();
  _icode.dest = highNibble(x);
  _icode.src = lowNibble(x);
};

opName[0x22] = "new-instance";
opArgs[0x22] = function(_dcode, _icode, _dex) {
  _icode.op = "new-instance";
  _icode.dest = _dcode.get();
  _icode.type = _dex.types[_dcode.get16()];
};

//////////////////////////////////////// ARRAY COMMANDS ////////////////////////////////////////
opName[0x23] = "new-array";
opArgs[0x23] = function(_dcode, _icode, _dex) {
  _icode.op = "new-array";
  var x = _dcode.get();
  _icode.dest = lowNibble(x);
  _icode.sizeReg = highNibble(x);
  _icode.type = _dex.types[_dcode.get16()];
};

opName[0x24] = "filled-new-array";
opArgs[0x24] = function(_dcode, _icode, _dex) {
  _icode.op = "filled-new-array";
  var x = _dcode.get();
  _icode.dimensions = highNibble(x);
  _icode.reg = [];
  _icode.reg[4] = lowNibble(x);
  _icode.type = _dex.types[_dcode.get16()];
  x = _dcode.get();
  _icode.reg[1] = highNibble(x);
  _icode.reg[0] = lowNibble(x);
  x = _dcode.get();
  _icode.reg[3] = highNibble(x);
  _icode.reg[2] = lowNibble(x);
};

opName[0x25] = "filled-new-array/range";
opArgs[0x25] = function(_dcode, _icode, _dex) {

  _icode.op = "filled-new-array";
  _icode.dimensions = _dcode.get();
  _icode.type = _dex.types[_dcode.get16()];
  _icode.reg = [];
  var x = _dcode.get16();
  var i;
  for (i = 0; i < _icode.dimensions; i++) {
    _icode.reg[i] = x++;
  }
};

opName[0x26] = "fill-array-data";
opArgs[0x26] = function(_dcode, _icode, _dex) {
  _icode.op = "fill-array";
  _icode.dest = _dcode.get();
  
  // each code unit is 2 bytes
  // (-6) because it's relative to the beginning of the opCode:
  // 1 - opCode name
  // 1 - src reg
  // 4 - offset to data
  var relativeOffset = (_dcode.get32()*2) -6;// relative offset
  var currentOffset = _dcode.offset;
  var tableOffset = relativeOffset + currentOffset;
  _dcode.seek(tableOffset);

  var magicNum = _dcode.get16();//get magic number
  assert( magicNum === 0x0300, "fill-array-data payload magic number is bad");
  var elementWidth = _dcode.get16(); // width of array element
  var numElements = _dcode.get32(); //size of array
  var i;
  _icode.data = []; // data
  
  // Acquiring data 
  for (i=0; i< numElements; i++) {
    switch (elementWidth) {
      case 1:
        _icode.data[i] = _dcode.get();
        break;
      case 2:
        _icode.data[i] = _dcode.get16();
        break;
      case 4:
        _icode.data[i] = _dcode.get32();
        break;
      case 8:
        _icode.data[i] = gLong.fromBits(_dcode.get32(), _dcode.get32());
        break;
      default:
        assert(false, "Unidentified data size in array");
    }
  }

  _dcode.seek(currentOffset);// return to previous position  
};


//////////////////////////////////////// Exceptions ////////////////////////////////////////
opName[0x27] = "throw";
opArgs[0x27] = function(_dcode, _icode, _dex) {
  _icode.op = "throw";
  _icode.src = _dcode.get();
};

//////////////////////////////////////// CONTROL COMMANDS ////////////////////////////////////////
opName[0x28] = "goto";
opArgs[0x28] = function(_dcode, _icode, _dex) {
  _icode.op = "goto";
  _icode.addrOffset = signExtend(_dcode.get(), 8, 32);
};
opName[0x29] = "goto/16";
opArgs[0x29] = function(_dcode, _icode, _dex) {
  _icode.op = "goto";
  // BECAUSE THE SPEC IS A LIE!!!
  _dcode.get();
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
};

opName[0x2a] = "goto/32";
opArgs[0x2a] = function(_dcode, _icode, _dex) {
  _icode.op = "goto";
  _icode.addrOffset = _dcode.get32();
};

opName[0x2b] = "packed-switch";
opArgs[0x2b] = function(_dcode, _icode, _dex) {
  _icode.op = "switch";

  _icode.src = _dcode.get();
  
  // each code unit is 2 bytes
  // (-6) because it's relative to the beginning of the opCode:
  // 1 - opCode name
  // 1 - src reg
  // 4 - offset to data
  var relativeOffset = (_dcode.get32()*2) -6;// relative offset
  var currentOffset = _dcode.offset;
  var tableOffset = relativeOffset + currentOffset;
  _dcode.seek(tableOffset);
  var magicNum = _dcode.get16();//get magic number
  assert( magicNum === 0x0100, "Pack switch payload magic number is bad");
  var arraySize = _dcode.get16(); // entries into array
  var firstKey = _dcode.get32(); //first key and lowest switch value
  var i;
  _icode.cases = []; // cases statements
  _icode.addrOffsets = []; // case statements jump address
  // Acquiring targets 
  for (i=0; i< arraySize; i++) {
    _icode.cases[i] = firstKey + i; //
    _icode.addrOffsets [i] = _dcode.get32();
  }
  _dcode.seek(currentOffset);// return to previous position  
};

opName[0x2c] = "sparse-switch";
opArgs[0x2c] = function(_dcode, _icode, _dex) {
  _icode.op = "switch";
  _icode.src = _dcode.get();
  
  // each code unit is 2 bytes
  // (-6) because it's relative to the beginning of the opCode:
  // 1 - opCode name
  // 1 - src reg
  // 4 - offset to data
  var relativeOffset = (_dcode.get32()*2) -6;// relative offset
  var currentOffset = _dcode.offset; // current location
  var tableOffset = relativeOffset + currentOffset; // where to go next
  _dcode.seek(tableOffset);
  var magicNum = _dcode.get16();//get magic number
  assert( magicNum === 0x0200, "Sparse switch payload magic number is bad");
  var arraySize = _dcode.get16(); // entries into array
  var k;
  _icode.cases = []; // cases statements
  // Acquiring keys and sort from low to high
  for (k=0; k<arraySize; k++) {
    _icode.cases[k] = _dcode.get32();
    //_icode.case.sort(function(a,b){return a-b});
  }
  var i;
  _icode.addrOffsets = []; // case statements jump address
  // Acquiring case statement jump targets
  for (i=0; i<arraySize; i++) {
    _icode.addrOffsets [i] = _dcode.get32();                
  }
  _dcode.seek(currentOffset);// return to previous position  
};


//////////////////////////////////////// COMPARATORS COMMANDS ////////////////////////////////////////
opName[0x2d] = "cmpl-float";
opArgs[0x2d] = function(_dcode, _icode, _dex) {
  _icode.op = "cmp";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.bias = "lt";
  _icode.type = TYPE_FLOAT;
};

opName[0x2e] = "cmpg-float";
opArgs[0x2e] = function(_dcode, _icode, _dex) {
  _icode.op = "cmp";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.bias = "gt";
  _icode.type = TYPE_FLOAT;
};

opName[0x2f] = "cmpl-double";
opArgs[0x2f] = function(_dcode, _icode, _dex) {
  _icode.op = "cmp";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.bias = "lt";
  _icode.type = TYPE_DOUBLE;
};

opName[0x30] = "cmpg-double";
opArgs[0x30] = function(_dcode, _icode, _dex) {
  _icode.op = "cmp";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.bias = "gt";
  _icode.type = TYPE_DOUBLE;
};

opName[0x31] = "cmp-long";
opArgs[0x31] = function(_dcode, _icode, _dex) {
  _icode.op = "cmp";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};


//////////////////////////////////////// CONTROL-COMPARATORS COMMANDS ////////////////////////////////////////
opName[0x32] = "if-eq";
opArgs[0x32] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  varA4varB4offset16(_dcode, _icode, _dex);
  _icode.cmp = "eq";
};

opName[0x33] = "if-ne";
opArgs[0x33] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  varA4varB4offset16(_dcode, _icode, _dex);
  _icode.cmp = "ne";
};

opName[0x34] = "if-lt";
opArgs[0x34] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  varA4varB4offset16(_dcode, _icode, _dex);
  _icode.cmp = "lt";
};

opName[0x35] = "if-ge";
opArgs[0x35] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  varA4varB4offset16(_dcode, _icode, _dex);
  _icode.cmp = "ge";
};

opName[0x36] = "if-gt";
opArgs[0x36] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  varA4varB4offset16(_dcode, _icode, _dex);
  _icode.cmp = "gt";
};

opName[0x37] = "if-le";
opArgs[0x37] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  varA4varB4offset16(_dcode, _icode, _dex);
  _icode.cmp = "le";
};

opName[0x38] = "if-eqz";
opArgs[0x38] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  _icode.varA = _dcode.get();
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
  _icode.cmp = "eq";
};

opName[0x39] = "if-nez";
opArgs[0x39] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  _icode.varA = _dcode.get();
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
  _icode.cmp = "ne";
};

opName[0x3a] = "if-ltz";
opArgs[0x3a] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  _icode.varA = _dcode.get();
  _icode.cmp = "lt";
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
};

opName[0x3b] = "if-gez";
opArgs[0x3b] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  _icode.varA = _dcode.get();
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
  _icode.cmp = "ge";
};

opName[0x3c] = "if-gtz";
opArgs[0x3c] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  _icode.varA = _dcode.get();
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
  _icode.cmp = "gt";
};

opName[0x3d] = "if-lez";
opArgs[0x3d] = function(_dcode, _icode, _dex) {
  _icode.op = "if";
  _icode.varA = _dcode.get();
  _icode.addrOffset = signExtend(_dcode.get16(), 16, 32);
  _icode.cmp = "le";
};

//////////////////////////////////////// ARRAY OPS ////////////////////////////////////////
opName[0x44] = "aget";
opArgs[0x44] = function(_dcode, _icode, _dex) {
  _icode.op = "array-get";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x45] = "aget-wide";
opArgs[0x45] = function(_dcode, _icode, _dex) {
  _icode.op = "array-get";
  _icode.wide = true;
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x46] = "aget-object";
opArgs[0x46] = function(_dcode, _icode, _dex) {
  _icode.op = "array-get";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x47] = "aget-boolean";
opArgs[0x47] = function(_dcode, _icode, _dex) {
  _icode.op = "array-get";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_BOOLEAN;
};

opName[0x48] = "aget-byte";
opArgs[0x48] = function(_dcode, _icode, _dex) {
  _icode.op = "array-get";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_BYTE;
};

opName[0x49] = "aget-char";
opArgs[0x49] = function(_dcode, _icode, _dex) {
  _icode.op = "array-get";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_CHAR;
};

opName[0x4a] = "aget-short";
opArgs[0x4a] = function(_dcode, _icode, _dex) {
  _icode.op = "array-get";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_SHORT;
};

opName[0x4b] = "aput";
opArgs[0x4b] = function(_dcode, _icode, _dex) {
  _icode.op = "array-put";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x4c] = "aput-wide";
opArgs[0x4c] = function(_dcode, _icode, _dex) {
  _icode.op = "array-put";
  _icode.wide = true;
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x4d] = "aput-object";
opArgs[0x4d] = function(_dcode, _icode, _dex) {
  _icode.op = "array-put";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x4e] = "aput-boolean";
opArgs[0x4e] = function(_dcode, _icode, _dex) {
  _icode.op = "array-put";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_BOOLEAN;
};

opName[0x4f] = "aput-byte";
opArgs[0x4f] = function(_dcode, _icode, _dex) {
  _icode.op = "array-put";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_BYTE;
};

opName[0x50] = "aput-char";
opArgs[0x50] = function(_dcode, _icode, _dex) {
  _icode.op = "array-put";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_CHAR;
};

opName[0x51] = "aput-short";
opArgs[0x51] = function(_dcode, _icode, _dex) {
  _icode.op = "array-put";
  arrayTriplet(_dcode, _icode, _dex);
  _icode.type = TYPE_SHORT;
};


//////////////////////////////////////// INSTANCE OPS ////////////////////////////////////////
opName[0x52] = "iget";
opArgs[0x52] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-get";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x53] = "iget-wide";
opArgs[0x53] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-get";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
  _icode.wide = true;
};

opName[0x54] = "iget-object";
opArgs[0x54] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-get";
  val4obj4field16(_dcode, _icode, _dex);
  //var _x = _icode.obj;
  //_icode.obj = _dex.classes[_x];
  _icode.type = TYPE_OBJECT;
};

opName[0x55] = "iget-boolean";
opArgs[0x55] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-get";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_BOOLEAN;
};

opName[0x56] = "iget-byte";
opArgs[0x56] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-get";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_BYTE;
};

opName[0x57] = "iget-char";
opArgs[0x57] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-get";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_CHAR;
};

opName[0x58] = "iget-short";
opArgs[0x58] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-get";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_SHORT;
};

opName[0x59] = "iput";
opArgs[0x59] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-put";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x5a] = "iput-wide";
opArgs[0x5a] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-put";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
  _icode.wide = true;
};

opName[0x5b] = "iput-object";
opArgs[0x5b] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-put";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_OBJECT;
};

opName[0x5c] = "iput-boolean";
opArgs[0x5c] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-put";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_BOOLEAN;
};

opName[0x5d] = "iput-byte";
opArgs[0x5d] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-put";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_BYTE;
};

opName[0x5e] = "iput-char";
opArgs[0x5e] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-put";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_CHAR;
};

opName[0x5f] = "iput-short";
opArgs[0x5f] = function(_dcode, _icode, _dex) {
  _icode.op = "instance-put";
  val4obj4field16(_dcode, _icode, _dex);
  _icode.type = TYPE_SHORT;
};


//////////////////////////////////////// STATIC OPS ////////////////////////////////////////
opName[0x60] = "sget";
opArgs[0x60] = function(_dcode, _icode, _dex) {
  _icode.op = "static-get";
  _icode.type = TYPE_INT;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x61] = "sget-wide";
opArgs[0x61] = function(_dcode, _icode, _dex) {
  _icode.op = "static-get";
  _icode.type = TYPE_LONG;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x62] = "sget-object";
opArgs[0x62] = function(_dcode, _icode, _dex) {
  _icode.op = "static-get";
  _icode.type = TYPE_OBJECT;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x63] = "sget-boolean";
opArgs[0x63] = function(_dcode, _icode, _dex) {
  _icode.op = "static-get";
  _icode.type = TYPE_BOOLEAN;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x64] = "sget-byte";
opArgs[0x64] = function(_dcode, _icode, _dex) {
  _icode.op = "static-get";
  _icode.type = TYPE_BYTE;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x65] = "sget-char";
opArgs[0x65] = function(_dcode, _icode, _dex) {
  _icode.op = "static-get";
  _icode.type = TYPE_CHAR;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x66] = "sget-short";
opArgs[0x66] = function(_dcode, _icode, _dex) {
  _icode.op = "static-get";
  _icode.type = TYPE_SHORT;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x67] = "sput";
opArgs[0x67] = function(_dcode, _icode, _dex) {
  _icode.op = "static-put";
  _icode.type = TYPE_INT;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x68] = "sput-wide";
opArgs[0x68] = function(_dcode, _icode, _dex) {
  _icode.op = "static-put";
  _icode.type = TYPE_INT;
  _icode.wide = true;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x69] = "sput-object";
opArgs[0x69] = function(_dcode, _icode, _dex) {
  _icode.op = "static-put";
  _icode.type = TYPE_OBJECT;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x6a] = "sput-boolean";
opArgs[0x6a] = function(_dcode, _icode, _dex) {
  _icode.op = "static-put";
  _icode.type = TYPE_BOOLEAN;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x6b] = "sput-byte";
opArgs[0x6b] = function(_dcode, _icode, _dex) {
  _icode.op = "static-put";
  _icode.type = TYPE_BYTE;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x6c] = "sput-char";
opArgs[0x6c] = function(_dcode, _icode, _dex) {
  _icode.op = "static-put";
  _icode.type = TYPE_CHAR;
  dest8field16(_dcode, _icode, _dex);
};

opName[0x6d] = "sput-short";
opArgs[0x6d] = function(_dcode, _icode, _dex) {
  _icode.op = "static-put";
  _icode.type = TYPE_SHORT;
  dest8field16(_dcode, _icode, _dex);
};

var arg5method16args = function (_dcode, _icode, _dex) {
  var _i, _x, _byte0;

  //
  // note that the bytecode spec thinks there is 16 bits of method index
  // it is wrong.
  //
  
  _byte0 = _dcode.get();
  _methodIndex = _dcode.get16();

  var argCount = highNibble(_byte0);

  _icode.method = _dex.methods[_methodIndex];

  // the remaining 3 bytes are argCount register arguments
  _icode.argumentRegisters = [];
  for(_i=0; _i<2; _i++) {
    _x = _dcode.get();
    _icode.argumentRegisters.push(lowNibble(_x));
    _icode.argumentRegisters.push(highNibble(_x));
  }
  _icode.argumentRegisters.push(lowNibble(_byte0));
  
  // chop to the right number of arguments
  _icode.argumentRegisters = _icode.argumentRegisters.splice(0, argCount);
  //console.log("args:" + _icode.argumentRegisters);
};

var arg8method16args16 = function (_dcode, _icode, _dex) {
  //---------------------------------------|
  // Relevant to all invoke-range opCodes: |
  // --------------------------------------|
  var _i, firstReg;

  var argCount = _dcode.get();
  var methodIndex = _dcode.get16();
  firstReg = _dcode.get16();

  _icode.method = _dex.methods[methodIndex];

  // Build the array of all needed arguements
  _icode.argumentRegisters = [];
  for (_i = 0; _i < argCount; _i++) {
    _icode.argumentRegisters.push(firstReg + _i);
  }

};

//////////////////////////////////////// HANDLING METHOD TYPES ////////////////////////////////////////
opName[0x6e] = "invoke-virtual";
opArgs[0x6e] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "virtual";
  arg5method16args(_dcode, _icode, _dex);
};

opName[0x6f] = "invoke-super";
opArgs[0x6f] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "super";
  arg5method16args(_dcode, _icode, _dex);
};

opName[0x70] = "invoke-direct";
opArgs[0x70] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "direct";
  arg5method16args(_dcode, _icode, _dex);
};

opName[0x71] = "invoke-static";
opArgs[0x71] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "static";
  arg5method16args(_dcode, _icode, _dex);
};

opName[0x72] = "invoke-interface";
opArgs[0x72] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "interface";
  arg5method16args(_dcode, _icode, _dex);
};

//0x73 is unused on purpose

opName[0x74] = "invoke-virtual/range";
opArgs[0x74] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "virtual";
  arg8method16args16(_dcode, _icode, _dex);
};

opName[0x75] = "invoke-super/range";
opArgs[0x75] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "super";
  arg8method16args16(_dcode, _icode, _dex);
};

opName[0x76] = "invoke-direct/range";
opArgs[0x76] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "direct";
  arg8method16args16(_dcode, _icode, _dex);
};

opName[0x77] = "invoke-static/range";
opArgs[0x77] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "static";
  arg8method16args16(_dcode, _icode, _dex);
};

opName[0x78] = "invoke-interface/range";
opArgs[0x78] = function(_dcode, _icode, _dex) {
  _icode.op = "invoke";
  _icode.kind = "interface";
  arg8method16args16(_dcode, _icode, _dex);
};

//0x79-7a unused

//////////////////////////////////////// VANILLA UNARY OPS ////////////////////////////////////////
opName[0x7b] = "neg-int";
opArgs[0x7b] = function(_dcode, _icode, _dex) {
  _icode.op = "negate";
  dest4src4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x7c] = "not-int";
opArgs[0x7c] = function(_dcode, _icode, _dex) {
  _icode.op = "not";
  dest4src4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x7d] = "neg-long";
opArgs[0x7d] = function(_dcode, _icode, _dex) {
  _icode.op = "negate";
  _icode.wide = true;
  dest4src4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x7e] = "not-long";
opArgs[0x7e] = function(_dcode, _icode, _dex) {
  _icode.op = "not";
  _icode.wide = true;
  dest4src4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x7f] = "neg-float";
opArgs[0x7f] = function(_dcode, _icode, _dex) {
  _icode.op = "negate";
  dest4src4(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0x80] = "neg-double";
opArgs[0x80] = function(_dcode, _icode, _dex) {
  _icode.op = "negate";
  _icode.wide = true;
  dest4src4(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

//// PRIMITIVE CAST

opName[0x81] = "int-to-long";
opArgs[0x81] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_INT;
  _icode.destType = TYPE_LONG;
};

opName[0x82] = "int-to-float";
opArgs[0x82] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_INT;
  _icode.destType = TYPE_FLOAT;
};

opName[0x83] = "int-to-double";
opArgs[0x83] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_INT;
  _icode.destType = TYPE_DOUBLE;
};

opName[0x84] = "long-to-int";
opArgs[0x84] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_LONG;
  _icode.destType = TYPE_INT;
};

opName[0x85] = "long-to-float";
opArgs[0x85] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_LONG;
  _icode.destType = TYPE_FLOAT;
};

opName[0x86] = "long-to-double";
opArgs[0x86] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_LONG;
  _icode.destType = TYPE_DOUBLE;
};

opName[0x87] = "float-to-int";
opArgs[0x87] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_FLOAT;
  _icode.destType = TYPE_INT;
};

opName[0x88] = "float-to-long";
opArgs[0x88] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_FLOAT;
  _icode.destType = TYPE_LONG;
};

opName[0x89] = "float-to-double";
opArgs[0x89] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_FLOAT;
  _icode.destType = TYPE_DOUBLE;
};

opName[0x8a] = "double-to-int";
opArgs[0x8a] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_DOUBLE;
  _icode.destType = TYPE_INT;
};

opName[0x8b] = "double-to-long";
opArgs[0x8b] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_DOUBLE;
  _icode.destType = TYPE_LONG;
};

opName[0x8c] = "double-to-float";
opArgs[0x8c] = function(_dcode, _icode, _dex) {
  _icode.op = "primitive-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_DOUBLE;
  _icode.destType = TYPE_FLOAT;
};

//// INT CAST

opName[0x8d] = "int-to-byte";
opArgs[0x8d] = function(_dcode, _icode, _dex) {
  _icode.op = "int-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_INT;
  _icode.destType = TYPE_BYTE;
};

opName[0x8e] = "int-to-char";
opArgs[0x8e] = function(_dcode, _icode, _dex) {
  _icode.op = "int-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_INT;
  _icode.destType = TYPE_CHAR;
};

opName[0x8f] = "int-to-short";
opArgs[0x8f] = function(_dcode, _icode, _dex) {
  _icode.op = "int-cast";
  dest4src4(_dcode, _icode, _dex);
  _icode.srcType = TYPE_INT;
  _icode.destType = TYPE_SHORT;
};


//////////////////////////////////////// VANILLA BINARY OPS ////////////////////////////////////////
opName[0x90] = "add-int";
opArgs[0x90] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x91] = "sub-int";
opArgs[0x91] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x92] = "mul-int";
opArgs[0x92] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x93] = "div-int";
opArgs[0x93] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x94] = "rem-int";
opArgs[0x94] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x95] = "and-int";
opArgs[0x95] = function(_dcode, _icode, _dex) {
  _icode.op = "and";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x96] = "or-int";
opArgs[0x96] = function(_dcode, _icode, _dex) {
  _icode.op = "or";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x97] = "xor-int";
opArgs[0x97] = function(_dcode, _icode, _dex) {
  _icode.op = "xor";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x98] = "shl-int";
opArgs[0x98] = function(_dcode, _icode, _dex) {
  _icode.op = "shl";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x99] = "shr-int";
opArgs[0x99] = function(_dcode, _icode, _dex) {
  _icode.op = "shr";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x9a] = "ushr-int";
opArgs[0x9a] = function(_dcode, _icode, _dex) {
  _icode.op = "ushr";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0x9b] = "add-long";
opArgs[0x9b] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x9c] = "sub-long";
opArgs[0x9c] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x9d] = "mul-long";
opArgs[0x9d] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x9e] = "div-long";
opArgs[0x9e] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0x9f] = "rem-long";
opArgs[0x9f] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xa0] = "and-long";
opArgs[0xa0] = function(_dcode, _icode, _dex) {
  _icode.op = "and";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xa1] = "or-long";
opArgs[0xa1] = function(_dcode, _icode, _dex) {
  _icode.op = "or";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xa2] = "xor-long";
opArgs[0xa2] = function(_dcode, _icode, _dex) {
  _icode.op = "xor";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xa3] = "shl-long";
opArgs[0xa3] = function(_dcode, _icode, _dex) {
  _icode.op = "shl";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xa4] = "shr-long";
opArgs[0xa4] = function(_dcode, _icode, _dex) {
  _icode.op = "shr";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xa5] = "ushr-long";
opArgs[0xa5] = function(_dcode, _icode, _dex) {
  _icode.op = "ushr";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xa6] = "add-float";
opArgs[0xa6] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xa7] = "sub-float";
opArgs[0xa7] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xa8] = "mul-float";
opArgs[0xa8] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xa9] = "div-float";
opArgs[0xa9] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xaa] = "rem-float";
opArgs[0xaa] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xab] = "add-double";
opArgs[0xab] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xac] = "sub-double";
opArgs[0xac] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xad] = "mul-double";
opArgs[0xad] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xae] = "div-double";
opArgs[0xae] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xaf] = "rem-double";
opArgs[0xaf] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  _icode.wide = true;
  dest8srcA8srcB8(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

// 2 addr varieties are like increment operators
//
// instead of A = B + C
// A is the same as B
// so we get A = A + B or A += B
//

opName[0xb0] = "add-int/2addr";
opArgs[0xb0] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb1] = "sub-int/2addr";
opArgs[0xb1] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb2] = "mul-int/2addr";
opArgs[0xb2] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb3] = "div-int/2addr";
opArgs[0xb3] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb4] = "rem-int/2addr";
opArgs[0xb4] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb5] = "and-int/2addr";
opArgs[0xb5] = function(_dcode, _icode, _dex) {
  _icode.op = "and";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb6] = "or-int/2addr";
opArgs[0xb6] = function(_dcode, _icode, _dex) {
  _icode.op = "or";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb7] = "xor-int/2addr";
opArgs[0xb7] = function(_dcode, _icode, _dex) {
  _icode.op = "xor";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb8] = "shl-int/2addr";
opArgs[0xb8] = function(_dcode, _icode, _dex) {
  _icode.op = "shl";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xb9] = "shr-int/2addr";
opArgs[0xb9] = function(_dcode, _icode, _dex) {
  _icode.op = "shr";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xba] = "ushr-int/2addr";
opArgs[0xba] = function(_dcode, _icode, _dex) {
  _icode.op = "ushr";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_INT;
};

opName[0xbb] = "add-long/2addr";
opArgs[0xbb] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xbc] = "sub-long/2addr";
opArgs[0xbc] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xbd] = "mul-long/2addr";
opArgs[0xbd] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xbe] = "div-long/2addr";
opArgs[0xbe] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xbf] = "rem-long/2addr";
opArgs[0xbf] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xc0] = "and-long/2addr";
opArgs[0xc0] = function(_dcode, _icode, _dex) {
  _icode.op = "and";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xc1] = "or-long/2addr";
opArgs[0xc1] = function(_dcode, _icode, _dex) {
  _icode.op = "or";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xc2] = "xor-long/2addr";
opArgs[0xc2] = function(_dcode, _icode, _dex) {
  _icode.op = "xor";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xc3] = "shl-long/2addr";
opArgs[0xc3] = function(_dcode, _icode, _dex) {
  _icode.op = "shl";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xc4] = "shr-long/2addr";
opArgs[0xc4] = function(_dcode, _icode, _dex) {
  _icode.op = "shr";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xc5] = "ushr-long/2addr";
opArgs[0xc5] = function(_dcode, _icode, _dex) {
  _icode.op = "ushr";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_LONG;
};

opName[0xc6] = "add-float/2addr";
opArgs[0xc6] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xc7] = "sub-float/2addr";
opArgs[0xc7] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xc8] = "mul-float/2addr";
opArgs[0xc8] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xc9] = "div-float/2addr";
opArgs[0xc9] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xca] = "rem-float/2addr";
opArgs[0xca] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_FLOAT;
};

opName[0xcb] = "add-double/2addr";
opArgs[0xcb] = function(_dcode, _icode, _dex) {
  _icode.op = "add";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xcc] = "sub-double/2addr";
opArgs[0xcc] = function(_dcode, _icode, _dex) {
  _icode.op = "sub";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xcd] = "mul-double/2addr";
opArgs[0xcd] = function(_dcode, _icode, _dex) {
  _icode.op = "mul";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xce] = "div-double/2addr";
opArgs[0xce] = function(_dcode, _icode, _dex) {
  _icode.op = "div";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xcf] = "rem-double/2addr";
opArgs[0xcf] = function(_dcode, _icode, _dex) {
  _icode.op = "rem";
  _icode.wide = true;
  destsrcA4srcB4(_dcode, _icode, _dex);
  _icode.type = TYPE_DOUBLE;
};

opName[0xd0] = "add-int/lit16";
opArgs[0xd0] = function(_dcode, _icode, _dex) {
  _icode.op = "add-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd1] = "rsub-int";
opArgs[0xd1] = function(_dcode, _icode, _dex) {
  _icode.op = "rsub-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd2] = "mul-int/lit16";
opArgs[0xd2] = function(_dcode, _icode, _dex) {
  _icode.op = "mul-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd3] = "div-int/lit16";
opArgs[0xd3] = function(_dcode, _icode, _dex) {
  _icode.op = "div-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd4] = "rem-int/lit16";
opArgs[0xd4] = function(_dcode, _icode, _dex) {
  _icode.op = "rem-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd5] = "and-int/lit16";
opArgs[0xd5] = function(_dcode, _icode, _dex) {
  _icode.op = "and-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd6] = "or-int/lit16";
opArgs[0xd6] = function(_dcode, _icode, _dex) {
  _icode.op = "or-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd7] = "xor-int/lit16";
opArgs[0xd7] = function(_dcode, _icode, _dex) {
  _icode.op = "xor-lit";
  dest4src4lit16(_dcode, _icode, _dex);
};

opName[0xd8] = "add-int/lit8";
opArgs[0xd8] = function(_dcode, _icode, _dex) {
  _icode.op = "add-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xd9] = "rsub-int/lit8";
opArgs[0xd9] = function(_dcode, _icode, _dex) {
  _icode.op = "rsub-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xda] = "mul-int/lit8";
opArgs[0xda] = function(_dcode, _icode, _dex) {
  _icode.op = "mul-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xdb] = "div-int/lit8";
opArgs[0xdb] = function(_dcode, _icode, _dex) {
  _icode.op = "div-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xdc] = "rem-int/lit8";
opArgs[0xdc] = function(_dcode, _icode, _dex) {
  _icode.op = "rem-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xdd] = "and-int/lit8";
opArgs[0xdd] = function(_dcode, _icode, _dex) {
  _icode.op = "and-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xde] = "or-int/lit8";
opArgs[0xde] = function(_dcode, _icode, _dex) {
  _icode.op = "or-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xdf] = "xor-int/lit8";
opArgs[0xdf] = function(_dcode, _icode, _dex) {
  _icode.op = "xor-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xe0] = "shl-int/lit8";
opArgs[0xe0] = function(_dcode, _icode, _dex) {
  _icode.op = "shl-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xe1] = "shr-int/lit8";
opArgs[0xe1] = function(_dcode, _icode, _dex) {
  _icode.op = "shr-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};

opName[0xe2] = "ushr-int/lit8";
opArgs[0xe2] = function(_dcode, _icode, _dex) {
  _icode.op = "ushr-lit";
  dest8src8lit8(_dcode, _icode, _dex);
};


//
// inputs:
//   _dex - for dex.strings, dex.types, dex.methods
//   _dcode - an ArrayFile of the dalvik code itself
//
// outputs:
//   array of objects in the following form:
//   { op: opcodeNumber, offset: #, args: []}
//
var icodeGen = function(_dex, _dcode) {
  var _op, _icode;
  var _icodeput = [];
  
  while(!_dcode.eof()) {
    _icode = {}; // our new "RISC" icode opcode
    
    // store offset as the number of code units
    _icode.offset = _dcode.offset / 2;

    // get the opcode itself
    _op = _dcode.get();

    // get name from table
    _icode.dalvikName = opName[_op];
    //console.log(hex(_icode.offset) +": "+ _icode.dalvikName);
    
    // get parser from table
    var parser = opArgs[_op];

    if(isUndefined(parser)) {
      console.log("Could not find a handler for opcode 0x"+hex(_op));
      return _icodeput;
    }
    
    // call it
    parser(_dcode, _icode, _dex);

    // this is a hack of sorts; dalvik instructions are pieced together in "code-units" which means that there's always an even number of bytes that should be consumed.
    if(_dcode.offset % 2) {
      _dcode.get();
    }

    // add it to result list
    _icodeput.push(_icode);
  }

  return _icodeput;
};




