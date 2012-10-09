// dependencies: leb128.js, terminal.js, util.js
'use strict';

var DEX_LOADER_DEBUG = true; // refresh-time constant

var dexLoader = (function() {

  // file format constants
  var DEX_FILE_MAGIC = [ 0x64, 0x65, 0x78, 0xa, 0x30, 0x33, 0x35, 0x00 ];
  var ENDIAN_CONSTANT = 0x12345678;
  var REVERSE_ENDIAN_CONSTANT = 0x78563412;

  // prints a line of debug information from dexLoader, if appropriate
  var debug = function(_s) { };
  if(DEX_LOADER_DEBUG) {
    //redirect calls to debug() to appropriate function
    
    //debug = console.log // for line numbers
    debug = terminal.println; // for debugging inline with other output
  }

  function File(_data) {
      //File constructor
      this.data=_data;
      this.offset=0;
      this.get=function(_chunk) { 
          var doc = 'Grabs a chunk of data. Arg options: none, 16, 32, uleb128';
          if (typeof _chunk === 'undefined'){
              return this.data[this.offset++]; 
          } else if (_chunk === 16){
              var _i = this.offset;
              var _d = this.data;
              this.offset += 2;
              // little endian
              return (_d[i+1] << 8) | _d[i];
          } else if (_chunk === 32){
              var _i = this.offset;
              var _d = this.data;
              this._offset += 4;
              // little endian
              return (_d[_i+3] << 24) | (_d[_i+2] << 16) | (_d[_i+1] << 8) | _d[_i];
          } else if (_chunk === 'uleb128'){
              var _file = this;
              return uleb128(function() { return _file.get(); });
          } else throw "Unrecognized argument to File constructor.";
      }; //end get
      this.seek=function(_newOffset) {
          this.offset = _newOffset;
      }; //end seek
  }; //end File constructor

  function Locator(_sectionName, _file, _chunk) {
      // A Locator instruction. Locator objects indicate the location within a file of a particular section.
      this.count=_file.get(_chunk);
      this.offset=_file.get(_chunk);
      this.name=_sectionName;
      if (DEX_LOADER_DEBUG){
          debug("Section \""+_sectionName+"\" size: 0x"+hex(_size)+" offset: 0x"+hex(_offset));
      };
  }; //end Locator

  function PrototypeMeta(_shortyDescriptor, _returnType){
      this.shortyDescriptor= _shortyDescriptor;
      this.returnType=_returnType;
  }; //end PrototypeMeta

  function Field(_definingClass, _type, _name){
      this.definingClass= _definingClass;
      this.type=_type;
      this.name= _name;
  }; //end Field

  function Method(_definingClass, _prototype, _name){
      this.definingClass=_definingClass;
      this.prototype=_prototype;
      this.name=_name;
  }; //end Method

  function EncodedField(_idx, _accessFlags){
      this.idx=_idx;
      this.accessFlags=_accessFlags;
  }; //end EncodedField
                 
  function TryBlock(_startAddr, insnCount, _handlerOff){
      this.startAddr=_startAddr;
      this.insnCount=_insnCount;
      this.handlerOff=_handlerOff;
  } //end TryBlock

  var readMUTF8 = function(_file) {
    var _bytes = [];
    while(1) {
      var c = _file.get();
      if ( _c === 0 )
        break;
      _bytes.push(_c);
    }
    return String.fromCharCode.apply(null, _bytes);
  }; //end readMUTF8

  var parseTypes = function(_file, _strings, _typeIds) {
    var _i;
    _file.seek(_typeIds.offset);
    var _numDescriptors = _typeIds.count;
    var _types = [];
    for(_i=0; _i<_numDescriptors; _i++) {
      _types[i] = _strings[_file.get(32)];
    }
    return _types;
  }; //end parseTypes

  var parseTypeList = function(_file, _types, _offset) {
    var _i;
    _file.seek(_offset);
    var _typeList = [];
    for(_i=0; _i<_file.get(16); _i++) {
      _typeList.push(_types[_file.get(16)]);
    }
    return _typeList;
  }; //end parseTypeList


  var parsePrototypes = function(_file, _strings, _types, _protoIds) {
    var _i;
    _file.seek(_protoIds.offset);
    var _numProtos = _protoIds.count;
    var _protos = [];
    for(_i=0; _i<_numProtos; _i++) {
      var _shortyIdx = _file.get(32);
      var _returnTypeIdx = _file.get(32);
      var _parametersOff = _file.get(32);
      _protos[_i] = PrototypeMeta(_strings[_shortyIdx], _types[_returnTypeIdx]);
    }
    for(_i=0; _i<_numProtos; _i++) {
      _protos[_i]._params = _parseTypeList(_file, _types, _parametersOff);
    }
    return _protos;
  };

  var parseStrings = function(_file, _stringIds) {
    var _i;
    //--- jump to string section
    _file.seek(_stringIds.offset);
    var _num_string_ids = string_ids.count;
    var _strings = [];
    var _offset = [];
    //--- loop through string_ids and save the offsets
    for(_i=0; _i<_numStringIds; _i++) {
      _offset.push(_file.get(32));
    }
    //--- go to each offset into data section and read the data there
    for(_i=0; _i<_numStringIds; _i++) {
      _file.seek(_offset[_i]);
      var _len = _file.get('uleb128');
      var _str = _readMUTF8(_file);
      //--- mutf-8 scares me
      if(_str.length !== _len) {
        console.log("BAD STRING LENGTH? code-points: " + _len + " strlen: " + _str.length);
      }

      _strings[_i] = _str;
    }
    return _strings;
  }; //end parseStrings


  var parseFields = function(_file, _strings, _types, _fieldIds) {
    var _i;
    _file.seek(_fieldIds.offset);
    var _numFields = _fieldIds.count;
    var _fields = [];
    for(_i=0; _i<_numFields; _i++) {
      var _classIdx = _file.get(16);
      var _typeIdx = _file.get(16);
      var _nameIdx = _file.get(32);
      _fields[_i] = Field(_types[_classIdx], _types[_typeIdx], _strings[_nameIdx]);
    }    
    return fields;
  }; //end parseFields

  var parseMethods = function(_file, _strings, _types, _protos, _methodIds) {
    var _i;
    _file.seek(_methodIds.offset);
    var _numMethods = _methodIds.count;
    var _methods = [];
    for(_i=0; _i<_numMethods; _i++) {
      var _classIdx = file.get(16);
      var _typeIdx = file.get(16);
      var _nameIdx = file.get(32);

      _methods[_i] = Method(_types[_classIdx], _protos[_typeIdx], _strings[_nameIdx]);
    }
    return _methods;
  }; //end parseMethods

  // parse "encoded_field" objects
  var parseEncodedFields = function(_file, _count) {
    var _i;
    var _fieldIdx = 0;
    var _fields = [];
    for(_i=0; _i<_count; _i++) {
      var _fieldIdxDiff = _file.get('uleb128');
      var _accessFlags = _file.get('uleb128');
      _fieldIdx += _fieldIdxDiff;
      _fields[_i] = EncodedField(_fieldIdx, _accessFlags);
    }
    return fields;
  }; //end parseEncodedFields

  // parse "code_item" objects
  var parseCode = function(_file, _codeOffset, _types, _fields, _methods) {
    var _i;
    _file.seek(_codeOffset);
    var _registersSize = _file.get(16); 
    var _insSize = _file.get(16); //don't think this var is actually used...
    var _outsSize = _file.get(16); //don't think this var is actually used...
    var _triesSize = _file.get(16);
    var _debugInfoOff = _file.get(32); //don't think this var is actually used...
    var _insnsSize = _file.get(32); // number of 16-bit code units
    
    var _codeUnits = [];
    for(_i=0; _i<_insnsSize; _i++) {
      // grab next 16 bytes
      _codeUnits.push(_file.get());
      _codeUnits.push(_file.get());
    }

    // if there were an odd number of instructions, then there is 16 bits of padding to make the next bit 4-byte aligned.
    if(_insnsSize % 2 == 1) {
      var _padding = _file.get(16);
      assert(_padding === 0, 'padding sanity check in code parsing');
    }
      // parse "try" blocks
    var _tries = [];
    for(var _i=0; _i<_triesSize; _i++) {
      _tries[i] = TryBlock(_file.get(32), _file.get(16), _file.get(16));
    }

    // parse associated "catch" blocks
    var _handlers = [];
    if(_triesSize) {
      // parse "encoded_catch_handler_list"
      var handlers_size = _file.get('uleb128');
      for(i=0; i<handlers_size; i++) {
        var catch_types = _file.get_sleb128();
        var catch_all_present = (catch_types < 0);
        catch_types = abs(catch_types);

        var catch_handlers = {};
        
        var j;
        for(j=0; j<catch_types; j++) {
          var type_id = _file.get('uleb128');
          var handler_addr = _file.get('uleb128');

          catch_handlers[ types[type_id] ] = handler_addr;
          // e.g. catch_handlers["Ljava/lang/String;"] = pointer to where that exception type is handled
        }
        if(catch_all_present) {
          var catch_all_addr = _file.get('uleb128');
          catch_handlers[""] = handler_addr;
        }

        handlers[i] = catch_handlers;
      }
    }

    // now translate codeUnits and other stuff
    debug(codeUnits.map(function(n){ return "0x"+hex(n); }).join(", "));

    // translateCode
    var code_File = array_File(codeUnits);

    var code_FileLen = codeUnits.length;

    while(code_File.offset < code_FileLen) {
      var start = code_File.offset;

      var op = code_File.get();
      var name = opcode[op].name;
      var format = opcode_format[op];


      debug("  " + name);

      code_File.seek(start + format.code_units*2);
    }

  }

  // parse "encoded_method" objects
  var parseEncodedMethods = function(_file, count, types, fields, methods) {
    var i;
    var method_idx = 0;
    var results = [];

    for(i=0; i<count; i++) {
      var method_idx_diff = _file.get('uleb128');
      var access_flags = _file.get('uleb128');
      var code_off = _file.get('uleb128');


      method_idx += method_idx_diff;

      var methodDef = methods[method_idx];
      var methodProto = methodDef.prototype;

      // save offset
      var nextMethodOffset = _file.offset;

      debug("parseCode for " + methodDef.name);
      // read in code for this method;
      var code = parseCode(_file, code_off, types, fields, methods);
      _file.seek(nextMethodOffset); // queue up next entry

      results[i] = {
        name: methodDef.name,
        parameterTypes: methodProto.params,
        returnType: methodProto.return_type,
        accessFlags: access_flags
      };

    }
    return results;
  }

  // parse "class_data_item" objects
  var parseClassData = function(classDef, _file, types, fields, methods) {
    var static_fields_size = _file.get('uleb128')
    var instance_fields_size = _file.get('uleb128')
    var direct_methods_size = _file.get('uleb128')
    var virtual_methods_size = _file.get('uleb128')

    debug("class has static="+static_fields_size+" instance="+instance_fields_size+" direct="+direct_methods_size+" virtual="+virtual_methods_size)

    classDef.staticFields = parseEncodedFields(_file, static_fields_size, fields)
    classDef.instanceFields = parseEncodedFields(_file, instance_fields_size, fields)
    classDef.directMethods = parseEncodedMethods(_file, direct_methods_size, types, fields, methods)
    classDef.virtualMethods = parseEncodedMethods(_file, virtual_methods_size, types, fields, methods)
  }

  // parse "class_def_item" objects
  var parseClasses = function(_file, strings, types, fields, methods, class_defs) {
    _file.seek(class_defs.offset)
    var i
    var num_classes = class_defs.count
    var classes = []

    for(i=0; i<num_classes; i++) {
      var class_idx = _file.get(32)
      var access_flags = _file.get(32)
      var superclass_idx = _file.get(32)
      var interfaces_off = _file.get(32)
      var source__file_idx = _file.get(32)
      var annotations_off = _file.get(32)
      var class_data_off = _file.get(32)
      var static_values_off = _file.get(32)

      // save offset for later
      var nextClassDef = _file.offset;

      // create a "Class.js" object
      var className = types[class_idx]
      var parentName = types[superclass_idx]
      var c = makeClass(className, parentName, access_flags);

      debug("Defining class \""+c.name+"\"...")

      if(interfaces_off !== 0) {
        _file.seek(interfaces_off)
        c.interfaces = parseTypeList(_file, types)
      }
      //--- Since annotations have no runtime effect, ignore
      if(class_data_off !== 0) {
        _file.seek(class_data_off)
        parseClassData(c, _file, types, fields, methods)
      }
      if(static_values_off !== 0) {
        _file.seek(static_values_off)
        c.static_values = parse_dex_class_static(_file)
      }

      classes[i] = c;

      // restore _file pointer if we went looking elsewhere
      _file.seek(nextClassDef);
    }
  }

  var parse = function(byte_data) {
    var i, j
    var N = byte_data.length;

    var _file = array_File(byte_data);

    //--- check magic number
    for(i=0; i<DEX__FILE_MAGIC.length; i++) {
      if(DEX__FILE_MAGIC[i] !== _file.get()) {
        debug("Error, DEX__FILE_MAGIC["+i+"] not found!\n")
        return
      }
    }
    debug("DEX__FILE_MAGIC correct");

    //--- skip checksum?
    var checksum = _file.get(32)
    debug("adler32 checksum: 0x" + hex(checksum))

    //--- SHA1 20 bytes
    var result=""
    for(i=0; i<20; i++) {
      result += hex(_file.get())
    }
    debug("SHA1: 0x" + result)

    var _file_size = _file.get(32)
    debug("_file_size: " + _file_size + " bytes, length="+N);
    if(_file_size !== N) {
      debug("_file size not correct!")
    }

    var header_size = _file.get(32)
    debug("header_size = 0x" + hex(header_size))

    var endian_tag = _file.get(32)
    debug("ENDIAN_TAG = 0x" + hex(endian_tag))
    if(endian_tag !== ENDIAN_CONSTANT) {
      debug("TODO need to do some sort of swapping with this _file")
    }

    var link = readSection("link", _file)

    var map_off = _file.get(32)
    debug("Map offset=0x"+hex(map_off))

    var string_ids = readSection("string_ids", _file)
    var type_ids = readSection("type_ids", _file)
    var proto_ids = readSection("proto_ids", _file)
    var field_ids = readSection("field_ids", _file)
    var method_ids = readSection("method_ids", _file)
    var class_defs = readSection("class_defs", _file)
    var data = readSection("data", _file)

    var strings = parseStrings(_file, string_ids)
    for(i=0; i<strings.length; i++) {
      var s = strings[i]
      debug("string["+i+"] len="+s.length+" data=\""+s+"\"")
    }

    var types = parseTypes(_file, strings, type_ids)
    for(i=0; i<types.length; i++) {
      debug("type["+i+"] = \""+types[i]+"\"");
    }

    var protos = parsePrototypes(_file, strings, types, proto_ids)
    for(i=0; i<protos.length; i++) {
      debug("prototype \""+protos[i].shorty_descriptor+"\" "+
            "( " + protos[i].params.join(", ") + " ) -> " +
            protos[i].return_type+"")
    }

    var fields = parseFields(_file, strings, types, field_ids)
    for(i=0; i<fields.length; i++) {
      var f = fields[i]
      debug("field:: class \"" + f.definingClass + "\" defines \"" + f.name + "\" which is a \"" + f.type + "\"")
    }

    var methods = parseMethods(_file, strings, types, protos, method_ids)
    for(i=0; i<methods.length; i++) {
      var m = methods[i]
      var p = m.prototype
      debug("method:: class \"" + m.definingClass + "\" defines \"" + m.name + "\" which is a (" + p.params.join(", ") + ") -> " + p.return_type)
    }

    var classes = parseClasses(_file, strings, types, fields, methods, class_defs)


  }
  
  return {
    load: function(byteArray) {
      return parse(byteArray);
    },
  }
})();

var factorial_dex_data = [100,101,120,10,48,51,53,0,167,89,189,132,47,234,107,172,232,6,142,202,253,174,255,246,36,16,249,50,144,236,206,154,204,2,0,0,112,0,0,0,120,86,52,18,0,0,0,0,0,0,0,0,44,2,0,0,14,0,0,0,112,0,0,0,7,0,0,0,168,0,0,0,3,0,0,0,196,0,0,0,1,0,0,0,232,0,0,0,4,0,0,0,240,0,0,0,1,0,0,0,16,1,0,0,156,1,0,0,48,1,0,0,118,1,0,0,126,1,0,0,129,1,0,0,142,1,0,0,165,1,0,0,185,1,0,0,205,1,0,0,208,1,0,0,212,1,0,0,216,1,0,0,237,1,0,0,253,1,0,0,3,2,0,0,8,2,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,9,0,0,0,6,0,0,0,5,0,0,0,0,0,0,0,7,0,0,0,5,0,0,0,104,1,0,0,8,0,0,0,5,0,0,0,112,1,0,0,4,0,2,0,12,0,0,0,1,0,0,0,0,0,0,0,1,0,2,0,11,0,0,0,2,0,1,0,13,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,29,2,0,0,0,0,0,0,1,0,1,0,1,0,0,0,17,2,0,0,4,0,0,0,112,16,3,0,0,0,14,0,3,0,1,0,2,0,0,0,22,2,0,0,8,0,0,0,98,0,0,0,19,1,45,0,110,32,2,0,16,0,14,0,1,0,0,0,0,0,0,0,1,0,0,0,6,0,6,60,105,110,105,116,62,0,1,73,0,11,76,102,97,99,116,111,114,105,97,108,59,0,21,76,106,97,118,97,47,105,111,47,80,114,105,110,116,83,116,114,101,97,109,59,0,18,76,106,97,118,97,47,108,97,110,103,47,79,98,106,101,99,116,59,0,18,76,106,97,118,97,47,108,97,110,103,47,83,121,115,116,101,109,59,0,1,86,0,2,86,73,0,2,86,76,0,19,91,76,106,97,118,97,47,108,97,110,103,47,83,116,114,105,110,103,59,0,14,102,97,99,116,111,114,105,97,108,46,106,97,118,97,0,4,109,97,105,110,0,3,111,117,116,0,7,112,114,105,110,116,108,110,0,2,0,7,14,0,14,1,0,7,14,120,0,0,0,2,0,0,128,128,4,176,2,1,9,200,2,0,13,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,14,0,0,0,112,0,0,0,2,0,0,0,7,0,0,0,168,0,0,0,3,0,0,0,3,0,0,0,196,0,0,0,4,0,0,0,1,0,0,0,232,0,0,0,5,0,0,0,4,0,0,0,240,0,0,0,6,0,0,0,1,0,0,0,16,1,0,0,1,32,0,0,2,0,0,0,48,1,0,0,1,16,0,0,2,0,0,0,104,1,0,0,2,32,0,0,14,0,0,0,118,1,0,0,3,32,0,0,2,0,0,0,17,2,0,0,0,32,0,0,1,0,0,0,29,2,0,0,0,16,0,0,1,0,0,0,44,2,0,0]

var classes_defined = dexLoader.load(factorial_dex_data)

