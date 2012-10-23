// Conventions:
//  ignored variables are listed with __*
//  private/local variables are listed with _*
//
//
//  Dependencies:
//    util.js bitutil.js
//    Field.js
//    MethodSignature.js
//    Method.js
//    Class.js
//    Type.js
//    TryRange.js
//    ArrayFile.js
//    icodeGen.js
//


// controls whether dexDebug does anything or not
var DEX_LOADER_DEBUG = true; // refresh-time constant

// prints a line of dexDebug information from dexLoader, if appropriate
var dexDebug = function(s) { };
if(DEX_LOADER_DEBUG) {
  dexDebug = function(s) { console.log(s); }; // for debugging inline with other output
  //dexDebug = console.log; // for debugging inline with other output
}

// file format constants
var DEX_FILE_MAGIC = [ 0x64, 0x65, 0x78, 0xa, 0x30, 0x33, 0x35, 0x00 ];
var DEX_HEADER_SIZE = 0x70;
var ENDIAN_CONSTANT = 0x12345678;
var REVERSE_ENDIAN_CONSTANT = 0x78563412;


var DEXSection = function(_fp) {
  this.count = _fp.get32(); // number of elements in the section
  this.offset = _fp.get32(); // location within the file
};

//--- A private class defining the overall data present in a DEX file
var DEXData = function(file) {
  var _i;

  this._file = file;

  this.strings = [];
  this.types = []; // array of Type
  this.prototypes = []; // array of {returnType, parameters}
  this.fields = []; // array of Field
  this.methods = []; // array of Method
  this.classes = []; // array of Class

  //--- parse the file
  this.parse();

  dexDebug("Done Parsing!");
  //console.log(this.classes); // uncommenting this on core.dex crashes firefox :)
  
};

DEXData.prototype.parse = function() {
  var _i;
  var _fp = this._file;

  //--- dex offsets depend on starting at the beginning
  assert(_fp.offset === 0, "DEX file starts at the beginning"); 

  //--- check magic number
  for(_i=0; _i<DEX_FILE_MAGIC.length; _i++) {
    var x = _fp.get();
    //dexDebug(hex(x));
    if(DEX_FILE_MAGIC[_i] !== x) {
      dexDebug("Error, DEX_FILE_MAGIC incorrect!\n");
      return;
    }
  }
  dexDebug("DEX_FILE_MAGIC correct");

  var __checksum = _fp.get32();
  
  var __sha1sum = "";
  for(_i=0; _i<20; _i++) {
    __sha1sum += hex(_fp.get());
  }

  var _fileSize = _fp.get32();
  assert(_fileSize === _fp.size(), "File size matches expected");
  
  var _headerSize = _fp.get32();
  assert(_headerSize === DEX_HEADER_SIZE, "Dex header size matches expected");

  var _endianTag = _fp.get32();
  assert(_endianTag === ENDIAN_CONSTANT, "Reverse Endian Dex files are not supported.");

  var __linkSize = _fp.get32();
  var __linkOffset = _fp.get32();

  var __mapOffset = _fp.get32();

  // locations of major sections
  var _stringSection = new DEXSection(_fp);
  var _typeSection = new DEXSection(_fp);
  var _prototypeSection = new DEXSection(_fp);
  var _fieldSection = new DEXSection(_fp);
  var _methodSection = new DEXSection(_fp);
  var _classSection = new DEXSection(_fp);
  //var _dataSection = new DEXSection(_fp);

  this._parseStrings(_stringSection);
  dexDebug(this.strings);
  this._parseTypes(_typeSection);
  dexDebug(this.types);
  this._parsePrototypes(_prototypeSection);
  dexDebug(enumerate("prototype", this.prototypes));
  this._parseFields(_fieldSection);
  dexDebug(this.fields);
  this._parseMethods(_methodSection);
  dexDebug(this.methods);
  this._parseClasses(_classSection);
  dexDebug(this.classes);
};

DEXData.prototype._parseStrings = function(_section) {
  var _i;
  var _fp = this._file;

  _fp.seek(_section.offset);

  var _strOffset = [];

  for(_i=0; _i<_section.count; _i++) {
    _strOffset.push(_fp.get32());
  }

  this.strings = [];
  for(_i=0; _i<_section.count; _i++) {
    _fp.seek(_strOffset[_i]);

    var len = _fp.getUleb128();
    //console.log("MUTF-8 len = " + len);
    this.strings[_i] = _fp.getMUTF8();

    //console.log("actual len = " + this.strings[_i].length);
    assert(this.strings[_i].length === len, "MUTF-8 length should agree with given length");
  }
};

DEXData.prototype._parseTypes = function(_section) {
  var _i;
  var _fp = this._file;

  _fp.seek(_section.offset);

  this.types = [];
  for(_i=0; _i<_section.count; _i++) {
    // get string by index and convert it to a Type object
    this.types[_i] = new Type(this.strings[_fp.get32()]);
  }
};

//--- returns a list of strings
DEXData.prototype._parseTypeList = function(_offset) {
  // offset of zero is used for empty type lists
  if(_offset === 0) {
    return [];
  }

  var _i, _count;
  var _fp = this._file;
  var _types = [];

  //--- save file offset, and jump to paramOffset
  var _here = _fp.offset;
  _fp.seek(_offset);

  //--- encoded as a number of types, and then a bunch of indices
  _count = _fp.get32();
  //dexDebug(_count);
  //assert(_count < 15, "Count is reasonable.");

  for(_i=0; _i<_count; _i++) {
    // get index and translate to type instantly
    _types[_i] = this.types[_fp.get16()] ;
  }

  //--- restore file offset;
  _fp.seek(_here); 

  return _types;
};

DEXData.prototype._parseClassFields = function(_count) {
  // if there's nothing to parse, we're done
  if(_count === 0) {
    return [];
  }

  var _i;
  var _fp = this._file;
  var _fields = [];
  
  //--- field ids are encoded by gap indexing
  var _currentIndex = 0;
  var _deltaIndex, _accessFlags;

  for(_i=0; _i<_count; _i++) {
    _deltaIndex = _fp.getUleb128();
    _accessFlags = _fp.getUleb128();

    // gap index
    _currentIndex += _deltaIndex;

    // pointer into field table
    var _f = this.fields[_currentIndex];
    _f.accessFlags = _accessFlags;
    
    _fields[_i] = _f;
  }

  return _fields;
};

DEXData.prototype._parseClassMethods = function(_count) {
  // if there's nothing to parse, we're done
  if(_count === 0) {
    return [];
  }

  var _i;
  var _fp = this._file;
  var _methods = [];
  
  //--- method ids are encoded by gap indexing
  var _currentIndex = 0;
  var _deltaIndex, _accessFlags, _codeOffset;

  for(_i=0; _i<_count; _i++) {
    _deltaIndex = _fp.getUleb128();
    _accessFlags = _fp.getUleb128();
    _codeOffset = _fp.getUleb128();

    // gap index
    _currentIndex += _deltaIndex;

    // pointer into method table
    var _m = this.methods[_currentIndex];
    // save that pointer in this classes list
    _methods[_i] = _m;

    _m.accessFlags = _accessFlags;
    _m.isNative = _codeOffset === 0;

    if(_codeOffset === 0) {
      //console.log("Native Method: " + _m.name + " in " + _m.definingClass);
      _codeOffset = 0;

    } else {
      //assert(_codeOffset !== 0, "Code should always exist!");

      //--- save file offset, and jump to _codeOffset
      var _here = _fp.offset;
      _fp.seek(_codeOffset);

      this._parseCode(_methods[_i]);

      //--- restore file offset
      _fp.seek(_here);
    }
  }

  return _methods;
};

DEXData.prototype._parseClassData = function(_class, _offset) {
  // offset of zero is used for nondata
  if(_offset === 0) {
    return;
  }

  var _i;
  var _fp = this._file;

  //--- save file offset, and jump to offset
  var _here = _fp.offset;
  _fp.seek(_offset);


  // get counts to parse
  var _numStaticFields = _fp.getUleb128();
  var _numInstanceFields = _fp.getUleb128();

  var _numDirectMethods = _fp.getUleb128();
  var _numVirtualMethods = _fp.getUleb128();

  // get actual fields after counts
  _class.staticFields = this._parseClassFields(_numStaticFields);
  _class.instanceFields = this._parseClassFields(_numInstanceFields);

  _class.directMethods = this._parseClassMethods(_numDirectMethods);
  _class.virtualMethods = this._parseClassMethods(_numVirtualMethods);


  //--- restore file offset;
  _fp.seek(_here); 
};

DEXData.prototype._parseAnnotation = function() {
  var _i;
  var _fp = this._file;

  var _typeIndex = _fp.getUleb128();
  var _count = _fp.getUleb128();

  for(_i=0; _i<_count; _i++) {
    var _nameIndex = _fp.getUleb128();
    var _value = this._parseEncodedValue();
  }
};

DEXData.prototype._parseEncodedValue = function() {
  //--- this is an enum used locally
  var ValueType = {
    Byte: 0x00,
    Short: 0x02,
    Char: 0x03,
    Int: 0x04,
    Long: 0x06,
    Float: 0x10,
    Double: 0x11,
    String: 0x17,
    Type: 0x18,
    Field: 0x19,
    Method: 0x1a,
    Enum: 0x1b,
    Array: 0x1c,
    Annotation: 0x1d,
    Null: 0x1e,
    Boolean: 0x1f,
  };

  var _i;
  var _fp = this._file;

  var _tagByte = _fp.get();
  // upper 3 bits is the "value_arg"
  var _valueArg = (_tagByte >> 5) & 0x7;
  // lower 5 bits is the "value_type"
  var _valueType = (_tagByte & 0x1f);

  var _value;

  // often the number of bytes
  var _size = _valueArg+1;


  //dexDebug("ValueType: 0x" + hex(_valueType));
  
  if(_valueType === ValueType.Byte) {
    _value = signExtend(_fp.get(),8,32);
  } else if(_valueType === ValueType.Short) {
    if(_size > 2) {
      _size = 2;
    }
    _value = _fp.getn(_size);
    _value = signExtend(_value, 8*_size, 32);
  } else if(_valueType === ValueType.Int) {
    if(_size > 4) {
      _size = 4;
    }
    _value = _fp.getn(_size);
    _value = signExtend(_value, 8*_size, 32);
  } else if(_valueType === ValueType.Long) {
    _value = {};
    _value.low = _fp.getn(max(_size, 4));
    _value.high = _fp.getn(max(_size-4, 0));

    //TODO long support
  } else if(_valueType === ValueType.Char) {
    _value = _fp.getn(_size);
  } else if(_valueType === ValueType.Float) {
    _value = _fp.getn(_size);
    //IEEE754 32-bit value
  } else if(_valueType === ValueType.Double) {
    _value = {};
    _value.low = _fp.getn(max(_size, 4));
    _value.high = _fp.getn(max(_size-4, 0));
    //TODO long support
  } else if(_valueType === ValueType.String) {
    _value = this.strings[_fp.getn(_size)];
  } else if(_valueType === ValueType.Type) {
    _value = this.types[_fp.getn(_size)];
  } else if(_valueType === ValueType.Field || _valueType === ValueType.Enum) {
    _value = this.fields[_fp.getn(_size)];
  } else if(_valueType === ValueType.Method) {
    _value = this.methods[_fp.getn(_size)];
  } else if(_valueType === ValueType.Array) {
    _value = this._parseEncodedArray(); // yay, recursion
  } else if(_valueType === ValueType.Annotation) {
    _value = this._parseAnnotation();
  } else if(_valueType === ValueType.Null) {
    _value = null;
  } else if(_valueType === ValueType.Boolean) {
    _value = _valueArg !== 0;
  } else {
    //assert(false, "Unknown ValueType " + _valueType);
    //console.log({type: _valueType, arg: _valueArg});
    _value = undefined;
  }
  
  return _value;
};

DEXData.prototype._parseEncodedArray = function() {
  var _i;
  var _fp = this._file;
  var _count = _fp.getUleb128();

  var _data = [];

  for(_i=0; _i<_count; _i++) {
    _data.push(this._parseEncodedValue());
  }

  return _data;
};

DEXData.prototype._parseStaticValues = function(_class, _offset) {
  if(_offset === 0) {
    return [];
  }

  var _i;
  var _fp = this._file;

  //--- save file offset, and jump to offset
  var _here = _fp.offset;
  _fp.seek(_offset);

  var numStaticFields = _class.staticFields.length;

  // read in all the values, possibly recursively
  var _values = this._parseEncodedArray();
  var _count = _values.length;

  // this is an array of entries; one for each "staticField"
  for(_i=0; _i<_count; _i++) {
    _class.staticFields[_i].value = _values[_i];
  }

  //--- restore file offset;
  _fp.seek(_here); 
};

DEXData.prototype._parsePrototypes = function(_section) {
  var _i;
  var _fp = this._file;

  _fp.seek(_section.offset);

  this.prototypes = [];
  for(_i=0; _i<_section.count; _i++) {
    var __shortyIndex = _fp.get32();
    var _returnTypeIndex = _fp.get32();
    var _paramOffset = _fp.get32();

    this.prototypes[_i] = {
      returnType: this.types[_returnTypeIndex],
      parameters: this._parseTypeList(_paramOffset),
    };
  }
};

DEXData.prototype._parseFields = function(_section) {
  var _i;
  var _fp = this._file;

  _fp.seek(_section.offset);

  this.fields = [];
  for(_i=0; _i<_section.count; _i++) {
    var _classIndex = _fp.get16();
    var _typeIndex = _fp.get16();
    var _nameIndex = _fp.get32();

    var _name = this.strings[_nameIndex];
    var _type = this.types[_typeIndex];
    var _defClass = this.types[_classIndex];

    this.fields[_i] = new Field(_name, _type, _defClass);
  }
};

DEXData.prototype._parseMethods = function(_section) {
  var _i;
  var _fp = this._file;

  _fp.seek(_section.offset);

  this.methods = [];
  for(_i=0; _i<_section.count; _i++) {
    var _classIndex = _fp.get16();
    var _protoIndex = _fp.get16();
    var _nameIndex = _fp.get32();

    var _proto = this.prototypes[_protoIndex];
    var _name = this.strings[_nameIndex];
    var _defClass = this.types[_classIndex];

    this.methods[_i] = new Method(_name, _defClass, _proto.parameters, _proto.returnType);
  }
};

DEXData.prototype._parseClasses = function(_section) {
  var _i;
  var _fp = this._file;

  _fp.seek(_section.offset);

  this.classes = [];
  for(_i=0; _i<_section.count; _i++) {
    var _classIndex = _fp.get32();
    var _accessFlags = _fp.get32();
    var _superIndex = _fp.get32();
    var _interfacesOffset = _fp.get32();
    var __srcFileIndex = _fp.get32();
    var __annotationsOffset = _fp.get32();
    var _classDataOffset = _fp.get32();
    var _staticValuesOffset = _fp.get32();

    this.classes[_i] = new Class(this.types[_classIndex], _accessFlags, this.types[_superIndex], this._parseTypeList(_interfacesOffset));
    this._parseClassData(this.classes[_i], _classDataOffset);
    //console.log("_parseStaticValues start ("+_staticValuesOffset+")");
    this._parseStaticValues(this.classes[_i], _staticValuesOffset);
    //console.log("_parseStaticValues done");
  }

};

//
// Takes the number of tries and the offset to icode translation array
//
DEXData.prototype._parseTryCatch = function(_numTries, _offset) {
  if(_numTries === 0) {
    return [];
  }

  var _convertAddress = makeAddressConverter(_offset);

  var _fp = this._file;
  var _startAddress;
  var _endAddress;
  var _numCatchTypes;
  var _catchAllExists;

  var _tryRanges = [];
  var _handlerOffset = [];

  for(_i=0; _i<_numTries; _i++) {
    // parse "try_item"
    // grab addresses and immediately convert them
    // 
    _startAddress = _convertAddress(_fp.get32());
    _endAddress = _convertAddress(_startAddress + _fp.get16());
    _handlerOffset[_i] = _fp.get16();
    
    // since addresses are defined to be not inclusive
    assert(_startAddress < _endAddress, "Start and End addresses of tryCatch are valid");

    // create with a null _catchBlock for now and fill in later
    _tryRanges[_i] = new TryRange(_startAddress, _endAddress, null);
  }

  // save file position
  var _startOffset = _fp.offset;

  // variables for this loop
  var _types, _addr, _catchAll;
  
  for(_i=0; _i<_numTries; _i++) {
    // reset variables
    _types = [];
    _addr = [];
    _catchAll = undefined;

    // jump to this handler & parse
    _fp.seek(_startOffset + _handlerOffset);

    // parse "encoded_catch_handler"
    // if numCatchTypes is negative, it has a catch all
    _numCatchTypes = _fp.getSleb128();
    _catchAllExists = (_numCatchTypes < 0);
    _numCatchTypes = abs(_numCatchTypes);

    for(_j=0; _j<_numCatchTypes; _j++) {
      _types[_j] = this.types[_fp.getUleb128()];
      _addr[_j] = _convertAddress(_fp.getUleb128());
    }
    if(_catchAllExists) {
      _catchAll = _convertAddress(_fp.getUleb128());
    }
    
    // break rules and modify _catchBlock
    _tryRanges[_i]._catchBlock = new CatchBlock(_types, _addr, _catchAll);
  }

  return _tryRanges;
};

//--- this method shall define
//    numRegisters
//    numInputs
//    numOutputs
//    icode
//    catches
//    etc.
//    upon the given method _m
//*** assumes this._file already points at the given code
DEXData.prototype._parseCode = function(_m) {
  var _i;
  var _fp = this._file;

  _m.numRegisters = _fp.get16();
  _m.numInputs = _fp.get16();
  
  _m.numOutputs = _fp.get16();
  var _numTries = _fp.get16();

  var __debugOffset = _fp.get32();

  // a code unit is a 16-bit chunk
  var _numCodeUnits = _fp.get32();

  var _byteCode = [];
  for(_i=0; _i<_numCodeUnits*2; _i++) {
    _byteCode.push(_fp.get());
  }

  dexDebug("_parseCode for " + _m.getName());
  // see icodeGen.js
  var _icode = icodeGen(this, new ArrayFile(_byteCode));

  dexDebug(enumerate("_icode",_icode));
  // create a translation list of offsets for this function, pulling the offset field out
  var _offsets = _icode.map(function(_inst) {
    var _off = _inst.offset;
    assert(!isUndefined(_off), "offset should not be undefined");
    delete _inst.offset;
    return _off;
  });

  // translateAddresses to icode-based (indexed) addressing, store in the method for later
  _m.icode = translateAddresses(_icode, _offsets);

  dexDebug(enumerate("_m.icode",_m.icode));

  // if there were an odd number of instructions, then there is an
  // extra two bytes of zeroes to preserve 4-byte alignment
  if((_numCodeUnits % 2) === 1) {
    var __padding = _fp.get16();
    assert(__padding === 0, "padding should be zero");
  }

  // grab try / catch and handler information
  //  returns an array of TryRange objects
  var _tryCatch = this._parseTryCatch(_numTries, _offsets);
  enumerate('try-catch', _tryCatch);

  return;
};


