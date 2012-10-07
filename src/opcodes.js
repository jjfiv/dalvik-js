'use strict';

var OP_NOP = 0x00;

var OP_MOVE = 0x01;
var OP_MOVE_FROM16 = 0x02;
var OP_MOVE_16 = 0x03;
var OP_MOVE_WIDE = 0x04;
var OP_MOVE_WIDE_FROM16 = 0x05;
var OP_MOVE_WIDE_16 = 0x06;
var OP_MOVE_OBJECT = 0x07;
var OP_MOVE_OBJECT_FROM16 = 0x08;
var OP_MOVE_OBJECT_16 = 0x09;
var OP_MOVE_RESULT = 0x0A;
var OP_MOVE_RESULT_WIDE = 0x0B;
var OP_MOVE_RESULT_OBJECT = 0x0C;
var OP_MOVE_EXCEPTION = 0x0D;

var OP_RETURN_VOID = 0x0E;
var OP_RETURN = 0x0F;
var OP_RETURN_WIDE = 0x10;
var OP_RETURN_OBJECT = 0x11;

var OP_CONST_4 = 0x12;
var OP_CONST_16 = 0x13;
var OP_CONST = 0x14;
var OP_CONST_HIGH16 = 0x15;
var OP_CONST_WIDE_16 = 0x16;
var OP_CONST_WIDE_32 = 0x17;
var OP_CONST_WIDE = 0x18;
var OP_CONST_WIDE_HIGH16 = 0x19;
var OP_CONST_STRING = 0x1A;
var OP_CONST_STRING_JUMBO = 0x1B;
var OP_CONST_CLASS = 0x1C;

var OP_MONITOR_ENTER = 0x1D;
var OP_MONITOR_EXIT = 0x1E;

var OP_CHECK_CAST = 0x1F;
var OP_INSTANCE_OF = 0x20;

var OP_ARRAY_LENGTH = 0x21;

var OP_NEW_INSTANCE = 0x22;
var OP_NEW_ARRAY = 0x23;
var OP_FILLED_NEW_ARRAY = 0x24;
var OP_FILLED_NEW_ARRAY_RANGE = 0x25;
var OP_FILL_ARRAY_DATA = 0x26;

var OP_THROW = 0x27;

var OP_GOTO = 0x28;
var OP_GOTO_16 = 0x29;
var OP_GOTO_32 = 0x2A;

var OP_PACKED_SWITCH = 0x2B;
var OP_SPARSE_SWITCH = 0x2C;

var OP_CMPL_FLOAT = 0x2D;
var OP_CMPG_FLOAT = 0x2E;
var OP_CMPL_DOUBLE = 0x2F;
var OP_CMPG_DOUBLE = 0x30;
var OP_CMP_LONG = 0x31;

var OP_IF_EQ = 0x32;
var OP_IF_NE = 0x33;
var OP_IF_LT = 0x34;
var OP_IF_GE = 0x35;
var OP_IF_GT = 0x36;
var OP_IF_LE = 0x37;
var OP_IF_EQZ = 0x38;
var OP_IF_NEZ = 0x39;
var OP_IF_LTZ = 0x3A;
var OP_IF_GEZ = 0x3B;
var OP_IF_GTZ = 0x3C;
var OP_IF_LEZ = 0x3D;

var OP_AGET = 0x44;
var OP_AGET_WIDE = 0x45;
var OP_AGET_OBJECT = 0x46;
var OP_AGET_BOOLEAN = 0x47;
var OP_AGET_BYTE = 0x48;
var OP_AGET_CHAR = 0x49;
var OP_AGET_SHORT = 0x4A;

var OP_APUT = 0x4B;
var OP_APUT_WIDE = 0x4C;
var OP_APUT_OBJECT = 0x4D;
var OP_APUT_BOOLEAN = 0x4E;
var OP_APUT_BYTE = 0x4F;
var OP_APUT_CHAR = 0x50;
var OP_APUT_SHORT = 0x51;

var OP_IGET = 0x52;
var OP_IGET_WIDE = 0x53;
var OP_IGET_OBJECT = 0x54;
var OP_IGET_BOOLEAN = 0x55;
var OP_IGET_BYTE = 0x56;
var OP_IGET_CHAR = 0x57;
var OP_IGET_SHORT = 0x58;

var OP_IPUT = 0x59;
var OP_IPUT_WIDE = 0x5A;
var OP_IPUT_OBJECT = 0x5B;
var OP_IPUT_BOOLEAN = 0x5C;
var OP_IPUT_BYTE = 0x5D;
var OP_IPUT_CHAR = 0x5E;
var OP_IPUT_SHORT = 0x5F;

var OP_SGET = 0x60;
var OP_SGET_WIDE = 0x61;
var OP_SGET_OBJECT = 0x62;
var OP_SGET_BOOLEAN = 0x63;
var OP_SGET_BYTE = 0x64;
var OP_SGET_CHAR = 0x65;
var OP_SGET_SHORT = 0x66;

var OP_SPUT = 0x67;
var OP_SPUT_WIDE = 0x68;
var OP_SPUT_OBJECT = 0x69;
var OP_SPUT_BOOLEAN = 0x6A;
var OP_SPUT_BYTE = 0x6B;
var OP_SPUT_CHAR = 0x6C;
var OP_SPUT_SHORT = 0x6D;

var OP_INVOKE_VIRTUAL = 0x6E;
var OP_INVOKE_SUPER = 0x6F;
var OP_INVOKE_DIRECT = 0x70;
var OP_INVOKE_STATIC = 0x71;
var OP_INVOKE_INTERFACE = 0x72;
var OP_INVOKE_VIRTUAL_RANGE = 0x74;
var OP_INVOKE_SUPER_RANGE = 0x75;
var OP_INVOKE_DIRECT_RANGE = 0x76;
var OP_INVOKE_STATIC_RANGE = 0x77;
var OP_INVOKE_INTERFACE_RANGE = 0x78;

var OP_NEG_INT = 0x7B;
var OP_NOT_INT = 0x7C;
var OP_NEG_LONG = 0x7D;
var OP_NOT_LONG = 0x7E;
var OP_NEG_FLOAT = 0x7F;
var OP_NEG_DOUBLE = 0x80;

var OP_INT_TO_LONG = 0x81;
var OP_INT_TO_FLOAT = 0x82;
var OP_INT_TO_DOUBLE = 0x83;
var OP_LONG_TO_INT = 0x84;
var OP_LONG_TO_FLOAT = 0x85;
var OP_LONG_TO_DOUBLE = 0x86;
var OP_FLOAT_TO_INT = 0x87;
var OP_FLOAT_TO_LONG = 0x88;
var OP_FLOAT_TO_DOUBLE = 0x89;
var OP_DOUBLE_TO_INT = 0x8A;
var OP_DOUBLE_TO_LONG = 0x8B;
var OP_DOUBLE_TO_FLOAT = 0x8C;
var OP_INT_TO_BYTE = 0x8D;
var OP_INT_TO_CHAR = 0x8E;
var OP_INT_TO_SHORT = 0x8F;

var OP_ADD_INT = 0x90;
var OP_SUB_INT = 0x91;
var OP_MUL_INT = 0x92;
var OP_DIV_INT = 0x93;
var OP_REM_INT = 0x94;
var OP_AND_INT = 0x95;
var OP_OR_INT = 0x96;
var OP_XOR_INT = 0x97;
var OP_SHL_INT = 0x98;
var OP_SHR_INT = 0x99;
var OP_USHR_INT = 0x9A;


var OP_ADD_LONG = 0x9B;
var OP_SUB_LONG = 0x9C;
var OP_MUL_LONG = 0x9D;
var OP_DIV_LONG = 0x9E;
var OP_REM_LONG = 0x9F;
var OP_AND_LONG = 0xA0;
var OP_OR_LONG = 0xA1;
var OP_XOR_LONG = 0xA2;
var OP_SHL_LONG = 0xA3;
var OP_SHR_LONG = 0xA4;
var OP_USHR_LONG = 0xA5;


var OP_ADD_FLOAT = 0xA6;
var OP_SUB_FLOAT = 0xA7;
var OP_MUL_FLOAT = 0xA8;
var OP_DIV_FLOAT = 0xA9;
var OP_REM_FLOAT = 0xAA;


var OP_ADD_DOUBLE = 0xAB;
var OP_SUB_DOUBLE = 0xAC;
var OP_MUL_DOUBLE = 0xAD;
var OP_DIV_DOUBLE = 0xAE;
var OP_REM_DOUBLE = 0xAF;


var OP_ADD_INT_2ADDR = 0xB0;
var OP_SUB_INT_2ADDR = 0xB1;
var OP_MUL_INT_2ADDR = 0xB2;
var OP_DIV_INT_2ADDR = 0xB3;
var OP_REM_INT_2ADDR = 0xB4;
var OP_AND_INT_2ADDR = 0xB5;
var OP_OR_INT_2ADDR = 0xB6;
var OP_XOR_INT_2ADDR = 0xB7;
var OP_SHL_INT_2ADDR = 0xB8;
var OP_SHR_INT_2ADDR = 0xB9;
var OP_USHR_INT_2ADDR = 0xBA;


var OP_ADD_LONG_2ADDR = 0xBB;
var OP_SUB_LONG_2ADDR = 0xBC;
var OP_MUL_LONG_2ADDR = 0xBD;
var OP_DIV_LONG_2ADDR = 0xBE;
var OP_REM_LONG_2ADDR = 0xBF;
var OP_AND_LONG_2ADDR = 0xC0;
var OP_OR_LONG_2ADDR = 0xC1;
var OP_XOR_LONG_2ADDR = 0xC2;
var OP_SHL_LONG_2ADDR = 0xC3;
var OP_SHR_LONG_2ADDR = 0xC4;
var OP_USHR_LONG_2ADDR = 0xC5;


var OP_ADD_FLOAT_2ADDR = 0xC6;
var OP_SUB_FLOAT_2ADDR = 0xC7;
var OP_MUL_FLOAT_2ADDR = 0xC8;
var OP_DIV_FLOAT_2ADDR = 0xC9;
var OP_REM_FLOAT_2ADDR = 0xCA;


var OP_ADD_DOUBLE_2ADDR = 0xCB;
var OP_SUB_DOUBLE_2ADDR = 0xCC;
var OP_MUL_DOUBLE_2ADDR = 0xCD;
var OP_DIV_DOUBLE_2ADDR = 0xCE;
var OP_REM_DOUBLE_2ADDR = 0xCF;


var OP_ADD_INT_LIT16 = 0xD0;
var OP_RSUB_INT = 0xD1;
var OP_MUL_INT_LIT16 = 0xD2;
var OP_DIV_INT_LIT16 = 0xD3;
var OP_REM_INT_LIT16 = 0xD4;
var OP_AND_INT_LIT16 = 0xD5;
var OP_OR_INT_LIT16 = 0xD6;
var OP_XOR_INT_LIT16 = 0xD7;


var OP_ADD_INT_LIT8 = 0xD8;
var OP_RSUB_INT_LIT8 = 0xD9;
var OP_MUL_INT_LIT8 = 0xDA;
var OP_DIV_INT_LIT8 = 0xDB;
var OP_REM_INT_LIT8 = 0xDC;
var OP_AND_INT_LIT8 = 0xDD;
var OP_OR_INT_LIT8 = 0xDE;
var OP_XOR_INT_LIT8 = 0xDF;
var OP_SHL_INT_LIT8 = 0xE0;
var OP_SHR_INT_LIT8 = 0xE1;
var OP_USHR_INT_LIT8 = 0xE2;


// Dalvik VM opcode list

var opcode = [];

opcode[0x00] = { name: "nop" };

opcode[0x01] = { name: "move" };
opcode[0x02] = { name: "move/from16" };
opcode[0x03] = { name: "move/16" };
opcode[0x04] = { name: "move-wide" };
opcode[0x05] = { name: "move-wide/from16" };
opcode[0x06] = { name: "move-wide/16" };
opcode[0x07] = { name: "move-object" };
opcode[0x08] = { name: "move-object/from16" };
opcode[0x09] = { name: "move-object/16" };
opcode[0x0a] = { name: "move-result" };
opcode[0x0b] = { name: "move-result-wide" };
opcode[0x0c] = { name: "move-result-object" };
opcode[0x0d] = { name: "move-exception" };

opcode[0x0e] = { name: "return-void" };
opcode[0x0f] = { name: "return" };
opcode[0x10] = { name: "return-wide" };
opcode[0x11] = { name: "return-object" };

opcode[0x12] = { name: "const/4" };
opcode[0x13] = { name: "const/16" };
opcode[0x14] = { name: "const" };
opcode[0x15] = { name: "const/high16" };
opcode[0x16] = { name: "const-wide/16" };
opcode[0x17] = { name: "const-wide/32" };
opcode[0x18] = { name: "const-wide" };
opcode[0x19] = { name: "const-wide/high16" };
opcode[0x1a] = { name: "const-string" };
opcode[0x1b] = { name: "const-string/jumbo" };
opcode[0x1c] = { name: "const-class" };

opcode[0x1d] = { name: "monitor-enter" };
opcode[0x1e] = { name: "monitor-exit" };

opcode[0x1f] = { name: "check-cast" };
opcode[0x20] = { name: "instance-of" };

opcode[0x21] = { name: "array-length" };

opcode[0x22] = { name: "new-instance" };
opcode[0x23] = { name: "new-array" };
opcode[0x24] = { name: "filled-new-array" };
opcode[0x25] = { name: "filled-new-array/range" };
opcode[0x26] = { name: "fill-array-data" };

opcode[0x27] = { name: "throw" };

opcode[0x28] = { name: "goto" };
opcode[0x29] = { name: "goto/16" };
opcode[0x2a] = { name: "goto/32" };

opcode[0x2b] = { name: "packed-switch" };
opcode[0x2c] = { name: "sparse-switch" };

opcode[0x2d] = { name: "cmpl-float" };
opcode[0x2e] = { name: "cmpg-float" };
opcode[0x2f] = { name: "cmpl-double" };
opcode[0x30] = { name: "cmpg-double" };
opcode[0x31] = { name: "cmp-long" };

opcode[0x32] = { name: "if-eq" };
opcode[0x33] = { name: "if-ne" };
opcode[0x34] = { name: "if-lt" };
opcode[0x35] = { name: "if-ge" };
opcode[0x36] = { name: "if-gt" };
opcode[0x37] = { name: "if-le" };
opcode[0x38] = { name: "if-eqz" };
opcode[0x39] = { name: "if-nez" };
opcode[0x3a] = { name: "if-ltz" };
opcode[0x3b] = { name: "if-gez" };
opcode[0x3c] = { name: "if-gtz" };
opcode[0x3d] = { name: "if-lez" };

opcode[0x44] = { name: "aget" };
opcode[0x45] = { name: "aget-wide" };
opcode[0x46] = { name: "aget-object" };
opcode[0x47] = { name: "aget-boolean" };
opcode[0x48] = { name: "aget-byte" };
opcode[0x49] = { name: "aget-char" };
opcode[0x4a] = { name: "aget-short" };

opcode[0x4b] = { name: "aput" };
opcode[0x4c] = { name: "aput-wide" };
opcode[0x4d] = { name: "aput-object" };
opcode[0x4e] = { name: "aput-boolean" };
opcode[0x4f] = { name: "aput-byte" };
opcode[0x50] = { name: "aput-char" };
opcode[0x51] = { name: "aput-short" };

opcode[0x52] = { name: "iget" };
opcode[0x53] = { name: "iget-wide" };
opcode[0x54] = { name: "iget-object" };
opcode[0x55] = { name: "iget-boolean" };
opcode[0x56] = { name: "iget-byte" };
opcode[0x57] = { name: "iget-char" };
opcode[0x58] = { name: "iget-short" };

opcode[0x59] = { name: "iput" };
opcode[0x5a] = { name: "iput-wide" };
opcode[0x5b] = { name: "iput-object" };
opcode[0x5c] = { name: "iput-boolean" };
opcode[0x5d] = { name: "iput-byte" };
opcode[0x5e] = { name: "iput-char" };
opcode[0x5f] = { name: "iput-short" };

opcode[0x60] = { name: "sget" };
opcode[0x61] = { name: "sget-wide" };
opcode[0x62] = { name: "sget-object" };
opcode[0x63] = { name: "sget-boolean" };
opcode[0x64] = { name: "sget-byte" };
opcode[0x65] = { name: "sget-char" };
opcode[0x66] = { name: "sget-short" };

opcode[0x67] = { name: "sput" };
opcode[0x68] = { name: "sput-wide" };
opcode[0x69] = { name: "sput-object" };
opcode[0x6a] = { name: "sput-boolean" };
opcode[0x6b] = { name: "sput-byte" };
opcode[0x6c] = { name: "sput-char" };
opcode[0x6d] = { name: "sput-short" };

opcode[0x6e] = { name: "invoke-virtual" };
opcode[0x6f] = { name: "invoke-super" };
opcode[0x70] = { name: "invoke-direct" };
opcode[0x71] = { name: "invoke-static" };
opcode[0x72] = { name: "invoke-interface" };
opcode[0x74] = { name: "invoke-virtual/range" };
opcode[0x75] = { name: "invoke-super/range" };
opcode[0x76] = { name: "invoke-direct/range" };
opcode[0x77] = { name: "invoke-static/range" };
opcode[0x78] = { name: "invoke-interface/range" };

opcode[0x7b] = { name: "neg-int" };
opcode[0x7c] = { name: "not-int" };
opcode[0x7d] = { name: "neg-long" };
opcode[0x7e] = { name: "not-long" };
opcode[0x7f] = { name: "neg-float" };
opcode[0x80] = { name: "neg-double" };

opcode[0x81] = { name: "int-to-long" };
opcode[0x82] = { name: "int-to-float" };
opcode[0x83] = { name: "int-to-double" };
opcode[0x84] = { name: "long-to-int" };
opcode[0x85] = { name: "long-to-float" };
opcode[0x86] = { name: "long-to-double" };
opcode[0x87] = { name: "float-to-int" };
opcode[0x88] = { name: "float-to-long" };
opcode[0x89] = { name: "float-to-double" };
opcode[0x8a] = { name: "double-to-int" };
opcode[0x8b] = { name: "double-to-long" };
opcode[0x8c] = { name: "double-to-float" };
opcode[0x8d] = { name: "int-to-byte" };
opcode[0x8e] = { name: "int-to-char" };
opcode[0x8f] = { name: "int-to-short" };

opcode[0x90] = { name: "add-int" };
opcode[0x91] = { name: "sub-int" };
opcode[0x92] = { name: "mul-int" };
opcode[0x93] = { name: "div-int" };
opcode[0x94] = { name: "rem-int" };
opcode[0x95] = { name: "and-int" };
opcode[0x96] = { name: "or-int" };
opcode[0x97] = { name: "xor-int" };
opcode[0x98] = { name: "shl-int" };
opcode[0x99] = { name: "shr-int" };
opcode[0x9a] = { name: "ushr-int" };


opcode[0x9b] = { name: "add-long" };
opcode[0x9c] = { name: "sub-long" };
opcode[0x9d] = { name: "mul-long" };
opcode[0x9e] = { name: "div-long" };
opcode[0x9f] = { name: "rem-long" };
opcode[0xa0] = { name: "and-long" };
opcode[0xa1] = { name: "or-long" };
opcode[0xa2] = { name: "xor-long" };
opcode[0xa3] = { name: "shl-long" };
opcode[0xa4] = { name: "shr-long" };
opcode[0xa5] = { name: "ushr-long" };


opcode[0xa6] = { name: "add-float" };
opcode[0xa7] = { name: "sub-float" };
opcode[0xa8] = { name: "mul-float" };
opcode[0xa9] = { name: "div-float" };
opcode[0xaa] = { name: "rem-float" };


opcode[0xab] = { name: "add-double" };
opcode[0xac] = { name: "sub-double" };
opcode[0xad] = { name: "mul-double" };
opcode[0xae] = { name: "div-double" };
opcode[0xaf] = { name: "rem-double" };


opcode[0xb0] = { name: "add-int/2addr" };
opcode[0xb1] = { name: "sub-int/2addr" };
opcode[0xb2] = { name: "mul-int/2addr" };
opcode[0xb3] = { name: "div-int/2addr" };
opcode[0xb4] = { name: "rem-int/2addr" };
opcode[0xb5] = { name: "and-int/2addr" };
opcode[0xb6] = { name: "or-int/2addr" };
opcode[0xb7] = { name: "xor-int/2addr" };
opcode[0xb8] = { name: "shl-int/2addr" };
opcode[0xb9] = { name: "shr-int/2addr" };
opcode[0xba] = { name: "ushr-int/2addr" };


opcode[0xbb] = { name: "add-long/2addr" };
opcode[0xbc] = { name: "sub-long/2addr" };
opcode[0xbd] = { name: "mul-long/2addr" };
opcode[0xbe] = { name: "div-long/2addr" };
opcode[0xbf] = { name: "rem-long/2addr" };
opcode[0xc0] = { name: "and-long/2addr" };
opcode[0xc1] = { name: "or-long/2addr" };
opcode[0xc2] = { name: "xor-long/2addr" };
opcode[0xc3] = { name: "shl-long/2addr" };
opcode[0xc4] = { name: "shr-long/2addr" };
opcode[0xc5] = { name: "ushr-long/2addr" };


opcode[0xc6] = { name: "add-float/2addr" };
opcode[0xc7] = { name: "sub-float/2addr" };
opcode[0xc8] = { name: "mul-float/2addr" };
opcode[0xc9] = { name: "div-float/2addr" };
opcode[0xca] = { name: "rem-float/2addr" };


opcode[0xcb] = { name: "add-double/2addr" };
opcode[0xcc] = { name: "sub-double/2addr" };
opcode[0xcd] = { name: "mul-double/2addr" };
opcode[0xce] = { name: "div-double/2addr" };
opcode[0xcf] = { name: "rem-double/2addr" };


opcode[0xd0] = { name: "add-int/lit16" };
opcode[0xd1] = { name: "rsub-int" };
opcode[0xd2] = { name: "mul-int/lit16" };
opcode[0xd3] = { name: "div-int/lit16" };
opcode[0xd4] = { name: "rem-int/lit16" };
opcode[0xd5] = { name: "and-int/lit16" };
opcode[0xd6] = { name: "or-int/lit16" };
opcode[0xd7] = { name: "xor-int/lit16" };


opcode[0xd8] = { name: "add-int/lit8" };
opcode[0xd9] = { name: "rsub-int/lit8" };
opcode[0xda] = { name: "mul-int/lit8" };
opcode[0xdb] = { name: "div-int/lit8" };
opcode[0xdc] = { name: "rem-int/lit8" };
opcode[0xdd] = { name: "and-int/lit8" };
opcode[0xde] = { name: "or-int/lit8" };
opcode[0xdf] = { name: "xor-int/lit8" };
opcode[0xe0] = { name: "shl-int/lit8" };
opcode[0xe1] = { name: "shr-int/lit8" };
opcode[0xe2] = { name: "ushr-int/lit8" };

