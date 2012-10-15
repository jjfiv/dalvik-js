//--- A disassembler for Dalvik Bytecode
// dependencies : bitutil.js, dexLoader.js, util.js


// These are helper functions for parsing bytecode arguments
var dest4src4 = function(_fp, _op) {
  var x = _fp.get();
  _op.dest = highNibble(x);
  _op.src = lowNibble(x);
};

var dest8src16 = function(_fp, _op) {
  _op.dest = _fp.get();
  _op.src = _fp.get16();
};

var dest16src16 = function(_fp, _op) {
  _op.dest = _fp.get16();
  _op.src = _fp.get16();
};

var dest8field16 =  function(_code, _out, _dex) {
  _out.dest = _code.get();
  _out.field = _dex.fields[ _code.get16() ];
};

var src8field16 =  function(_code, _out, _dex) {
  _out.src = _code.get();
  _out.field = _dex.fields[ _code.get16() ];
};

var dest8src8lit8 = function(_code, _out, _dex) {
  _out.dest = _code.get();
  _out.src = _code.get();
  _out.literal = signExtend(_code.get(), 8, 32);
};


// Dalvik VM opcode names

var opName = []; // a list of names
var opArgs = []; // a list of function for getting the arguments

opName[0x00] = "nop";
opArgs[0x00] = function () { };

//////////////////////////////////////// MOVE COMMANDS ////////////////////////////////////////

opName[0x01] = "move", opArgs[0x01] = dest4src4;
opName[0x02] = "move/from16", opArgs[0x02] = dest8src16;
opName[0x03] = "move/16", opArgs[0x03] = dest16src16;
opName[0x04] = "move-wide", opName[0x05] = "move-wide/from16";
opName[0x06] = "move-wide/16", opArgs[0x06] = function(_code, _out, _dex) {
    _out.wide = true;
    _out.dest = _code.get16();
    _out.src = _code.get16();
};
opName[0x07] = "move-object", opArgs[0x07] = dest4src4;
opName[0x08] = "move-object/from16", opArgs[0x08] = dest8src16;
opName[0x09] = "move-object/16", opArgs[0x09] = dest16src16;
opName[0x0a] = "move-result";
opName[0x0b] = "move-result-wide";
opName[0x0c] = "move-result-object";
opName[0x0d] = "move-exception";

//////////////////////////////////////// RETURN COMMANDS ////////////////////////////////////////
// var dest8 = 
opName[0x0e] = "return-void", opArgs[0x0e] = function() { };
opName[0x0f] = "return", opArgs[0x0f] = function(_code, _op, _dex) {
    _op.dest = _code.get();
};
opName[0x10] = "return-wide", opArgs[0x0f] = function(_code, _op, _dex) {
    _op.dest = _code.get();
};
opName[0x11] = "return-object", opArgs[0x11] = function(_code, _op, _dex) {
    _op.dest = _code.get();
};

//////////////////////////////////////// HANDLING CONSTANTS ////////////////////////////////////////
opName[0x12] = "const/4", opArgs[0x12] = function(_fp, _op) {
    var x = _fp.get();
    _op.dest = highNibble(x);
    _op.value = signExtend(lowNibble(x), 4, 32);
};
opName[0x13] = "const/16", opArgs[0x13] = function(_fp, _op) {
    _op.dest = _fp.get();
    _op.value = signExtend(_fp.get16(), 16, 32);
};
opName[0x14] = "const";
opName[0x15] = "const/high16";
opName[0x16] = "const-wide/16";
opName[0x17] = "const-wide/32";
opName[0x18] = "const-wide";
opName[0x19] = "const-wide/high16";
opName[0x1a] = "const-string";
opName[0x1b] = "const-string/jumbo";
opName[0x1c] = "const-class";

//////////////////////////////////////// HANDLING MONITORS ////////////////////////////////////////
opName[0x1d] = "monitor-enter";
opName[0x1e] = "monitor-exit";

//////////////////////////////////////// TYPE SHIZZ ////////////////////////////////////////
opName[0x1f] = "check-cast";
opName[0x20] = "instance-of";
opName[0x21] = "array-length";
opName[0x22] = "new-instance";

//////////////////////////////////////// ARRAY COMMANDS ////////////////////////////////////////
opName[0x23] = "new-array", opArgs[0x23] = function(_code, _out, _dex) {
    _out.dest = _code.get();
    _out.sizeReg = _code.get();
    _out.type = _code.get16();
};
opName[0x24] = "filled-new-array";
opName[0x25] = "filled-new-array/range";
opName[0x26] = "fill-array-data";

//////////////////////////////////////// Exceptions ////////////////////////////////////////
opName[0x27] = "throw";

//////////////////////////////////////// CONTROL COMMANDS ////////////////////////////////////////
opName[0x28] = "goto";
opName[0x29] = "goto/16";
opName[0x2a] = "goto/32";
opName[0x2b] = "packed-switch";
opName[0x2c] = "sparse-switch";

//////////////////////////////////////// COMPARATORS COMMANDS ////////////////////////////////////////
opName[0x2d] = "cmpl-float";
opName[0x2e] = "cmpg-float";
opName[0x2f] = "cmpl-double";
opName[0x30] = "cmpg-double";
opName[0x31] = "cmp-long";

//////////////////////////////////////// CONTROL-COMPARATORS COMMANDS ////////////////////////////////////////
opName[0x32] = "if-eq";
opName[0x33] = "if-ne";
opName[0x34] = "if-lt";
opName[0x35] = "if-ge";
opName[0x36] = "if-gt";
opName[0x37] = "if-le";
opName[0x38] = "if-eqz";
opName[0x39] = "if-nez";
opName[0x3a] = "if-ltz";
opName[0x3b] = "if-gez";
opName[0x3c] = "if-gtz";
opName[0x3d] = "if-lez";

//////////////////////////////////////// ARRAY OPS ////////////////////////////////////////
opName[0x44] = "aget";
opName[0x45] = "aget-wide";
opName[0x46] = "aget-object";
opName[0x47] = "aget-boolean";
opName[0x48] = "aget-byte";
opName[0x49] = "aget-char";
opName[0x4a] = "aget-short";
opName[0x4b] = "aput";
opName[0x4c] = "aput-wide";
opName[0x4d] = "aput-object";
opName[0x4e] = "aput-boolean";
opName[0x4f] = "aput-byte";
opName[0x50] = "aput-char";
opName[0x51] = "aput-short";

//////////////////////////////////////// INSTANCE OPS ////////////////////////////////////////
opName[0x52] = "iget";
opName[0x53] = "iget-wide";
opName[0x54] = "iget-object";
opName[0x55] = "iget-boolean";
opName[0x56] = "iget-byte";
opName[0x57] = "iget-char";
opName[0x58] = "iget-short";
opName[0x59] = "iput";
opName[0x5a] = "iput-wide";
opName[0x5b] = "iput-object";
opName[0x5c] = "iput-boolean";
opName[0x5d] = "iput-byte";
opName[0x5e] = "iput-char";
opName[0x5f] = "iput-short";

//////////////////////////////////////// STATIC OPS ////////////////////////////////////////
setArrayRange(opArgs,0x60,0x66,dest8field16); //from util.js
opName[0x60] = "sget";
opName[0x61] = "sget-wide";
opName[0x62] = "sget-object";
opName[0x63] = "sget-boolean";
opName[0x64] = "sget-byte";
opName[0x65] = "sget-char";
opName[0x66] = "sget-short";
setArrayRange(opArgs,0x67,0x6d,src8field16);
opName[0x67] = "sput";
opName[0x68] = "sput-wide";
opName[0x69] = "sput-object";
opName[0x6a] = "sput-boolean";
opName[0x6b] = "sput-byte";
opName[0x6c] = "sput-char";
opName[0x6d] = "sput-short";

//////////////////////////////////////// HANDLING METHOD TYPES ////////////////////////////////////////
opName[0x6e] = "invoke-virtual";
opName[0x6f] = "invoke-super";
opName[0x70] = "invoke-direct", opArgs[0x70] = function(_code, _out, _dex) {
    var _i, x, byte0, byte1;
    
    byte0 = _code.get();
    byte1 = _code.get();
    
    var argCount = highNibble(byte0);
    // get next 12 bits; note that the spec is wrong here.
    var methodIndex = (lowNibble(byte0) << 8) | (byte1);
    
    _out.method = _dex.methods[methodIndex];
    
    _out.args = [];
    for(_i=0; _i<argCount; _i+=2) {
        x = _code.get();
        _out.args.push(highNibble(x));
        _out.args.push(lowNibble(x));
    }
    // chop off one if necessary
    _out.args.splice(0, argCount);
};
opName[0x71] = "invoke-static";
opName[0x72] = "invoke-interface";
opName[0x74] = "invoke-virtual/range";
opName[0x75] = "invoke-super/range";
opName[0x76] = "invoke-direct/range";
opName[0x77] = "invoke-static/range";
opName[0x78] = "invoke-interface/range";

//////////////////////////////////////// VANILLA UNARY OPS ////////////////////////////////////////
opName[0x7b] = "neg-int";
opName[0x7c] = "not-int";
opName[0x7d] = "neg-long";
opName[0x7e] = "not-long";
opName[0x7f] = "neg-float";
opName[0x80] = "neg-double";
opName[0x81] = "int-to-long";
opName[0x82] = "int-to-float";
opName[0x83] = "int-to-double";
opName[0x84] = "long-to-int";
opName[0x85] = "long-to-float";
opName[0x86] = "long-to-double";
opName[0x87] = "float-to-int";
opName[0x88] = "float-to-long";
opName[0x89] = "float-to-double";
opName[0x8a] = "double-to-int";
opName[0x8b] = "double-to-long";
opName[0x8c] = "double-to-float";
opName[0x8d] = "int-to-byte";
opName[0x8e] = "int-to-char";
opName[0x8f] = "int-to-short";

//////////////////////////////////////// VANILLA BINARY OPS ////////////////////////////////////////
opName[0x90] = "add-int";
opName[0x91] = "sub-int";
opName[0x92] = "mul-int";
opName[0x93] = "div-int";
opName[0x94] = "rem-int";
opName[0x95] = "and-int";
opName[0x96] = "or-int";
opName[0x97] = "xor-int";
opName[0x98] = "shl-int";
opName[0x99] = "shr-int";
opName[0x9a] = "ushr-int";
opName[0x9b] = "add-long";
opName[0x9c] = "sub-long";
opName[0x9d] = "mul-long";
opName[0x9e] = "div-long";
opName[0x9f] = "rem-long";
opName[0xa0] = "and-long";
opName[0xa1] = "or-long";
opName[0xa2] = "xor-long";
opName[0xa3] = "shl-long";
opName[0xa4] = "shr-long";
opName[0xa5] = "ushr-long";
opName[0xa6] = "add-float";
opName[0xa7] = "sub-float";
opName[0xa8] = "mul-float";
opName[0xa9] = "div-float";
opName[0xaa] = "rem-float";
opName[0xab] = "add-double";
opName[0xac] = "sub-double";
opName[0xad] = "mul-double";
opName[0xae] = "div-double";
opName[0xaf] = "rem-double";
opName[0xb0] = "add-int/2addr";
opName[0xb1] = "sub-int/2addr";
opName[0xb2] = "mul-int/2addr";
opName[0xb3] = "div-int/2addr";
opName[0xb4] = "rem-int/2addr";
opName[0xb5] = "and-int/2addr";
opName[0xb6] = "or-int/2addr";
opName[0xb7] = "xor-int/2addr";
opName[0xb8] = "shl-int/2addr";
opName[0xb9] = "shr-int/2addr";
opName[0xba] = "ushr-int/2addr";
opName[0xbb] = "add-long/2addr";
opName[0xbc] = "sub-long/2addr";
opName[0xbd] = "mul-long/2addr";
opName[0xbe] = "div-long/2addr";
opName[0xbf] = "rem-long/2addr";
opName[0xc0] = "and-long/2addr";
opName[0xc1] = "or-long/2addr";
opName[0xc2] = "xor-long/2addr";
opName[0xc3] = "shl-long/2addr";
opName[0xc4] = "shr-long/2addr";
opName[0xc5] = "ushr-long/2addr";
opName[0xc6] = "add-float/2addr";
opName[0xc7] = "sub-float/2addr";
opName[0xc8] = "mul-float/2addr";
opName[0xc9] = "div-float/2addr";
opName[0xca] = "rem-float/2addr";
opName[0xcb] = "add-double/2addr";
opName[0xcc] = "sub-double/2addr";
opName[0xcd] = "mul-double/2addr";
opName[0xce] = "div-double/2addr";
opName[0xcf] = "rem-double/2addr";
opName[0xd0] = "add-int/lit16";
opName[0xd1] = "rsub-int";
opName[0xd2] = "mul-int/lit16";
opName[0xd3] = "div-int/lit16";
opName[0xd4] = "rem-int/lit16";
opName[0xd5] = "and-int/lit16";
opName[0xd6] = "or-int/lit16";
opName[0xd7] = "xor-int/lit16";
setArrayRange(opArgs, 0xd8, 0xe2, dest8src8lit8);
opName[0xd8] = "add-int/lit8";
opName[0xd9] = "rsub-int/lit8";
opName[0xda] = "mul-int/lit8";
opName[0xdb] = "div-int/lit8";
opName[0xdc] = "rem-int/lit8";
opName[0xdd] = "and-int/lit8";
opName[0xde] = "or-int/lit8";
opName[0xdf] = "xor-int/lit8";
opName[0xe0] = "shl-int/lit8";
opName[0xe1] = "shr-int/lit8";
opName[0xe2] = "ushr-int/lit8";

//
// inputs:
//   _dex - for dex.strings, dex.types, dex.methods
//   _code - an ArrayFile of the code itself
//
// outputs:
//   array of objects in the following form:
//   { op: opcodeNumber, offset: #, args: []}
//
var icodeGen = function(_dex, _code) {
  var _op, _out;
  var _output = [];
  
  while(!_code.eof()) {
    _out = {}; // our new "RISC" icode opcode
    
    // store offset
    _out.offset = _code.offset;

    // get the opcode itself
    _op = _code.get();

    // get name from table
    _out.name = opName[_op];
    
    // get parser from table
    var parser = opArgs[_op];
    if(isUndefined(parser)) {
      console.log("Need to implement " + _out.name);
      break;
    }
    // call it
    parser(_code, _out, _dex);

    // add it to result list
    _output.push(_out);
  }

  return _output;
};




