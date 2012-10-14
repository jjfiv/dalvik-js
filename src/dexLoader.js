// Conventions:
//  ignored variables are listed with __*
//  private/local variables are listed with _*


// controls whether dexDebug does anything or not
var DEX_LOADER_DEBUG = true; // refresh-time constant

// prints a line of dexDebug information from dexLoader, if appropriate
var dexDebug = function(s) { };
if(DEX_LOADER_DEBUG) {
  dexDebug = function(s) { console.log(s); }; // for debugging inline with other output
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
    this.types[_i] = this.strings[_fp.get32()];
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
    // get index and translate to string instantly
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
    
    // get index and translate to string instantly
    _fields[_i] = { 
      definingClass: _f.definingClass,
      type: _f.type,
      name: _f.name,
      accessFlags: _accessFlags,
    };
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
    
    // get index and translate to string instantly
    _methods[_i] = { 
      definingClass: _m.definingClass,
      returnType: _m.returnType,
      parameters: _m.parameters,
      name: _m.name,
      accessFlags: _accessFlags,
      isNative: _codeOffset === 0,
    };

    if(_codeOffset === 0) {
      //console.log("Native Method: " + _m.name + " in " + _m.definingClass);
      _codeOffset = 0;

    } else {
      //assert(_codeOffset !== 0, "Code should always exist!");

      //--- save file offset, and jump to _codeOffset
      var _here = _fp.offset;
      _fp.seek(_codeOffset);

      this._translateCode(_methods[_i]);

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
      returnType: this.strings[_returnTypeIndex],
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

    this.fields[_i] = {
      definingClass: this.types[_classIndex],
      type: this.types[_typeIndex],
      name: this.strings[_nameIndex],
    };
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

    this.methods[_i] = {
      definingClass: this.types[_classIndex],
      returnType: _proto.returnType,
      parameters: _proto.parameters,
      name: this.strings[_nameIndex],
    };
  }

  //--- no longer need prototype definitions
  delete this.prototypes;
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

    this.classes[_i] = {
      name: this.types[_classIndex],
      parent: this.types[_superIndex],
      accessFlags: _accessFlags,
      interfaces: this._parseTypeList(_interfacesOffset),
    };

    this._parseClassData(this.classes[_i], _classDataOffset);
    //console.log("_parseStaticValues start ("+_staticValuesOffset+")");
    this._parseStaticValues(this.classes[_i], _staticValuesOffset);
    //console.log("_parseStaticValues done");
  }

};

DEXData.prototype._parseTryCatchInfo = function(_numTries) {
  if(_numTries === 0) {
    return [];
  }

  var _fp = this._file;
  var _i, _j;
  var _tries = []; // "try_item"s

  // this encodes the range of tries
  for(_i=0; _i<_numTries; _i++) {
    _tries[_i] = {
      startAddress: _fp.get32(),
      numInstructions: _fp.get16(),
      handlerOffset: _fp.get16(),
      handlers: [],
    };
  }

  // parse associated "catch" blocks
  var handlers = [];
  
  // parse "encoded_catch_handler_list"
  var _numHandlers = _fp.getUleb128();

  //assert(_numHandlers === _numTries, "num handlers === num tries?");

  for(_i=0; _i<_numHandlers; _i++) {
    var _numCatchTypes = _fp.getSleb128();
    var _catchAllExists = (_numCatchTypes < 0);
    _numCatchTypes = abs(_numCatchTypes);

    var _catchHandlers = {};

    for(_j=0; _j<_numCatchTypes; _j++) {
      var _typeIndex = _fp.getUleb128();
      var _handlerAddress = _fp.getUleb128();
      
      var _typeName = this.types[_typeIndex];
      _catchHandlers[ _typeName ] = _handlerAddress;
    }
    if(_catchAllExists) {
      _catchHandlers["*"] = _fp.getUleb128();
    }

    handlers[_i] = _catchHandlers;
  }
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
DEXData.prototype._translateCode = function(_m) {
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

  dexDebug(_m.name);
  // see icodeGen.js
  var icode = icodeGen(this, new ArrayFile(_byteCode));
  dexDebug(icode);

  // if there were an odd number of instructions, then there is an
  // extra two bytes of zeroes to preserve 4-byte alignment
  if((_numCodeUnits % 2) === 1) {
    var __padding = _fp.get16();
    assert(__padding === 0, "padding should be zero");
  }

  // grab try and handler information
  var _tryCatch = this._parseTryCatchInfo(_numTries);

  return;
};


