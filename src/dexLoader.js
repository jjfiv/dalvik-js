'use strict'

var DEX_LOADER_DEBUG = true // refresh-time constant

var dexLoader = (function() {

  // file format constants
  var DEX_FILE_MAGIC = [ 0x64, 0x65, 0x78, 0xa, 0x30, 0x33, 0x35, 0x00 ]
  var ENDIAN_CONSTANT = 0x12345678
  var REVERSE_ENDIAN_CONSTANT = 0x78563412

  //
  // arrayFile returns a "File" object wrapped around an array of data
  // this abstraction is used throughout the dex_loader functions
  //
  var arrayFile = function(data) {
    return {
      data: data,
      offset: 0,
      get: function() {
        return this.data[this.offset++];
      },
      get16: function() {
        var i = this.offset
        var d = this.data

        this.offset += 2;

        // little endian
        return (d[i+1] << 8) | d[i];
      },
      get32: function() {
        var i = this.offset
        var d = this.data

        this.offset += 4;

        // little endian
        return (d[i+3] << 24) | (d[i+2] << 16) | (d[i+1] << 8) | d[i];
      },
      get_uleb128: function() {
        var file = this;
        return uleb128(function() { return file.get() });
      },
      seek: function(new_offset) {
        this.offset = new_offset;
      }
    };
  }

  // prints a line of debug information from dexLoader, if appropriate
  var debug = function(s) { }
  if(DEX_LOADER_DEBUG) {
    //redirect calls to debug() to appropriate function
    
    //debug = console.log // for line numbers
    debug = terminal.println // for debugging inline with other output
  }

  var readSection = function(name, file) {
    var size = file.get32()
    var offset = file.get32()

    debug("Section \""+name+"\" size: 0x"+hex(size)+" offset: 0x"+hex(offset))

    return {
      count: size,
      offset: offset,
    }
  }

  var readMUTF8 = function(file) {
    var bytes = []
    while(1) {
      var c = file.get()
      if ( c === 0 )
        break
      bytes.push(c)
    }
    return String.fromCharCode.apply(null, bytes);
  }

  var parseTypes = function(file, strings, type_ids) {
    var i
    file.seek(type_ids.offset)
    var num_descriptors = type_ids.count

    var types = []
    for(i=0; i<num_descriptors; i++) {
      types[i] = strings[file.get32()]
    }
    return types
  }

  var parseTypeList = function(file, types, offset) {
    file.seek(offset)
    var count = file.get32()
    var i

    var type_list = []
    for(i=0; i<count; i++) {
      type_list.push(types[file.get16()])
    }
    return type_list;
  }

  var parsePrototypes = function(file, strings, types, proto_ids) {
    var i
    file.seek(proto_ids.offset)
    var num_protos = proto_ids.count

    var protos = []
    for(i=0; i<num_protos; i++) {
      var shorty_idx = file.get32()
      var return_type_idx = file.get32()
      var parameters_off = file.get32()

      protos[i] = {
        shorty_descriptor: strings[shorty_idx],
        return_type: types[return_type_idx],
      }

    }

    for(i=0; i<num_protos; i++) {
      protos[i].params = parseTypeList(file, types, parameters_off);

    }

    return protos;
  }

  var parseStrings = function(file, string_ids) {
    var i

    //--- jump to string section
    file.seek(string_ids.offset)
    var num_string_ids = string_ids.count

    //--- loop through string_ids and save the offsets
    var offset = []
    for(i=0; i<num_string_ids; i++) {
      offset.push(file.get32())
    }

    var strings = []
    //--- go to each offset into data section and read the data there
    for(i=0; i<num_string_ids; i++) {
      file.seek(offset[i])

      var len = file.get_uleb128()
      var str = readMUTF8(file)

      //--- mutf-8 scares me
      if(str.length !== len) {
        console.log("BAD STRING LENGTH? code-points: "+len + " strlen: "+str.length)
      }

      strings[i] = str
    }

    return strings
  }

  var parseFields = function(file, strings, types, field_ids) {
    file.seek(field_ids.offset)
    var num_fields = field_ids.count
    var i
    var fields = []

    for(i=0; i<num_fields; i++) {
      var class_idx = file.get16()
      var type_idx = file.get16()
      var name_idx = file.get32()

      fields[i] = {
        definingClass: types[class_idx],
        type: types[type_idx],
        name: strings[name_idx],
      }
    }
    return fields
  }

  var parseMethods = function(file, strings, types, protos, method_ids) {
    file.seek(method_ids.offset)
    var num_methods = method_ids.count
    var i
    var methods = []

    for(i=0; i<num_methods; i++) {
      var class_idx = file.get16()
      var type_idx = file.get16()
      var name_idx = file.get32()

      methods[i] = {
        definingClass: types[class_idx],
        prototype: protos[type_idx],
        name: strings[name_idx],
      }
    }
    return methods
  }

  // parse "encoded_field" objects
  var parseEncodedFields = function(file, count, fields) {
    var i;
    var field_idx = 0;
    var fields = []

    for(i=0; i<count; i++) {
      var field_idx_diff = file.get_uleb128()
      var access_flags = file.get_uleb128()

      field_idx += field_idx_diff;

      fields[i] = {
        idx: field_idx,
        access_flags: access_flags,
      }
    }
    return fields
  }

  // parse "encoded_method" objects
  var parseEncodedMethods = function(file, count, methods) {
    var i;
    var method_idx = 0;
    var methods = []

    for(i=0; i<count; i++) {
      var method_idx_diff = file.get_uleb128()
      var access_flags = file.get_uleb128()
      var code_off = file.get_uleb128()

      method_idx += method_idx_diff;

      methods[i] = {
        idx: method_idx,
        access_flags: access_flags,
        code_off: code_off
      }
    }
    return methods;
  }

  // parse "class_data_item" objects
  var parse_dex_class_data = function(file, fields, methods) {
    var static_fields_size = file.get_uleb128()
    var instance_fields_size = file.get_uleb128()
    var direct_methods_size = file.get_uleb128()
    var virtual_methods_size = file.get_uleb128()

    debug("class has static="+static_fields_size+" instance="+instance_fields_size+" direct="+direct_methods_size+" virtual="+virtual_methods_size)

    var static_fields = parseEncodedFields(file, static_fields_size, fields)
    var instance_fields = parseEncodedFields(file, instance_fields_size, fields)
    var direct_methods = parseEncodedMethods(file, direct_methods_size, methods)
    var virtual_methods = parseEncodedMethods(file, virtual_methods_size, methods)
  }

  // parse "class_def_item" objects
  var parseClasses = function(file, strings, types, fields, methods, class_defs) {
    file.seek(class_defs.offset)
    var i
    var num_classes = class_defs.count
    var classes = []

    for(i=0; i<num_classes; i++) {
      var class_idx = file.get32()
      var access_flags = file.get32()
      var superclass_idx = file.get32()
      var interfaces_off = file.get32()
      var source_file_idx = file.get32()
      var annotations_off = file.get32()
      var class_data_off = file.get32()
      var static_values_off = file.get32()

      // save offset for later
      var nextClassDef = file.offset;

      classes[i] = {
        name: types[class_idx],
        access: access_flags,
        super: types[superclass_idx],
        source_file: strings[source_file_idx],
      }

      debug("Defining class \""+classes[i].name+"\"...")

      if(interfaces_off !== 0) {
        file.seek(interfaces_off)
        classes[i].interfaces = parseTypeList(file, types)
      }
      if(annotations_off !== 0) {
        file.seek(annotations_off)
        classes[i].annotations = parse_dex_annotations(file)
      }
      if(class_data_off !== 0) {
        file.seek(class_data_off)
        classes[i].class_data = parse_dex_class_data(file, fields, methods)
      }
      if(static_values_off !== 0) {
        file.seek(static_values_off)
        classes[i].static_values = parse_dex_class_static(file)
      }

      // restore file pointer if we went looking elsewhere
      file.seek(nextClassDef);
    }
  }

  var loadDex = function(byte_data) {
    var i, j
    var N = byte_data.length;

    var file = arrayFile(byte_data);

    //--- check magic number
    for(i=0; i<DEX_FILE_MAGIC.length; i++) {
      if(DEX_FILE_MAGIC[i] !== file.get()) {
        debug("Error, DEX_FILE_MAGIC["+i+"] not found!\n")
        return
      }
    }
    debug("DEX_FILE_MAGIC correct");

    //--- skip checksum?
    var checksum = file.get32()
    debug("adler32 checksum: 0x" + hex(checksum))

    //--- SHA1 20 bytes
    var result=""
    for(i=0; i<20; i++) {
      result += hex(file.get())
    }
    debug("SHA1: 0x" + result)

    var file_size = file.get32()
    debug("file_size: " + file_size + " bytes, length="+N);
    if(file_size !== N) {
      debug("file size not correct!")
    }

    var header_size = file.get32()
    debug("header_size = 0x" + hex(header_size))

    var endian_tag = file.get32()
    debug("ENDIAN_TAG = 0x" + hex(endian_tag))
    if(endian_tag !== ENDIAN_CONSTANT) {
      debug("TODO need to do some sort of swapping with this file")
    }

    var link = readSection("link", file)

    var map_off = file.get32()
    debug("Map offset=0x"+hex(map_off))

    var string_ids = readSection("string_ids", file)
    var type_ids = readSection("type_ids", file)
    var proto_ids = readSection("proto_ids", file)
    var field_ids = readSection("field_ids", file)
    var method_ids = readSection("method_ids", file)
    var class_defs = readSection("class_defs", file)
    var data = readSection("data", file)

    var strings = parseStrings(file, string_ids)
    for(i=0; i<strings.length; i++) {
      var s = strings[i]
      debug("string["+i+"] len="+s.length+" data=\""+s+"\"")
    }

    var types = parseTypes(file, strings, type_ids)
    for(i=0; i<types.length; i++) {
      debug("type["+i+"] = \""+types[i]+"\"");
    }

    var protos = parsePrototypes(file, strings, types, proto_ids)
    for(i=0; i<protos.length; i++) {
      debug("prototype \""+protos[i].shorty_descriptor+"\" "+
            "( " + protos[i].params.join(", ") + " ) -> " +
            protos[i].return_type+"")
    }

    var fields = parseFields(file, strings, types, field_ids)
    for(i=0; i<fields.length; i++) {
      var f = fields[i]
      debug("field:: class \"" + f.definingClass + "\" defines \"" + f.name + "\" which is a \"" + f.type + "\"")
    }

    var methods = parseMethods(file, strings, types, protos, method_ids)
    for(i=0; i<methods.length; i++) {
      var m = methods[i]
      var p = m.prototype
      debug("method:: class \"" + m.definingClass + "\" defines \"" + m.name + "\" which is a (" + p.params.join(", ") + ") -> " + p.return_type)
    }

    var classes = parseClasses(file, strings, types, fields, methods, class_defs)

  }
  
  return {
    load: function(byteArray) {
      return loadDex(byteArray);
    },
  }
})();

var factorial_dex_data = [100,101,120,10,48,51,53,0,167,89,189,132,47,234,107,172,232,6,142,202,253,174,255,246,36,16,249,50,144,236,206,154,204,2,0,0,112,0,0,0,120,86,52,18,0,0,0,0,0,0,0,0,44,2,0,0,14,0,0,0,112,0,0,0,7,0,0,0,168,0,0,0,3,0,0,0,196,0,0,0,1,0,0,0,232,0,0,0,4,0,0,0,240,0,0,0,1,0,0,0,16,1,0,0,156,1,0,0,48,1,0,0,118,1,0,0,126,1,0,0,129,1,0,0,142,1,0,0,165,1,0,0,185,1,0,0,205,1,0,0,208,1,0,0,212,1,0,0,216,1,0,0,237,1,0,0,253,1,0,0,3,2,0,0,8,2,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,9,0,0,0,6,0,0,0,5,0,0,0,0,0,0,0,7,0,0,0,5,0,0,0,104,1,0,0,8,0,0,0,5,0,0,0,112,1,0,0,4,0,2,0,12,0,0,0,1,0,0,0,0,0,0,0,1,0,2,0,11,0,0,0,2,0,1,0,13,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,29,2,0,0,0,0,0,0,1,0,1,0,1,0,0,0,17,2,0,0,4,0,0,0,112,16,3,0,0,0,14,0,3,0,1,0,2,0,0,0,22,2,0,0,8,0,0,0,98,0,0,0,19,1,45,0,110,32,2,0,16,0,14,0,1,0,0,0,0,0,0,0,1,0,0,0,6,0,6,60,105,110,105,116,62,0,1,73,0,11,76,102,97,99,116,111,114,105,97,108,59,0,21,76,106,97,118,97,47,105,111,47,80,114,105,110,116,83,116,114,101,97,109,59,0,18,76,106,97,118,97,47,108,97,110,103,47,79,98,106,101,99,116,59,0,18,76,106,97,118,97,47,108,97,110,103,47,83,121,115,116,101,109,59,0,1,86,0,2,86,73,0,2,86,76,0,19,91,76,106,97,118,97,47,108,97,110,103,47,83,116,114,105,110,103,59,0,14,102,97,99,116,111,114,105,97,108,46,106,97,118,97,0,4,109,97,105,110,0,3,111,117,116,0,7,112,114,105,110,116,108,110,0,2,0,7,14,0,14,1,0,7,14,120,0,0,0,2,0,0,128,128,4,176,2,1,9,200,2,0,13,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,14,0,0,0,112,0,0,0,2,0,0,0,7,0,0,0,168,0,0,0,3,0,0,0,3,0,0,0,196,0,0,0,4,0,0,0,1,0,0,0,232,0,0,0,5,0,0,0,4,0,0,0,240,0,0,0,6,0,0,0,1,0,0,0,16,1,0,0,1,32,0,0,2,0,0,0,48,1,0,0,1,16,0,0,2,0,0,0,104,1,0,0,2,32,0,0,14,0,0,0,118,1,0,0,3,32,0,0,2,0,0,0,17,2,0,0,0,32,0,0,1,0,0,0,29,2,0,0,0,16,0,0,1,0,0,0,44,2,0,0]

dexLoader.load(factorial_dex_data)

