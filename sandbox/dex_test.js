var factorial_dex_data = [100,101,120,10,48,51,53,0,167,89,189,132,47,234,107,172,232,6,142,202,253,174,255,246,36,16,249,50,144,236,206,154,204,2,0,0,112,0,0,0,120,86,52,18,0,0,0,0,0,0,0,0,44,2,0,0,14,0,0,0,112,0,0,0,7,0,0,0,168,0,0,0,3,0,0,0,196,0,0,0,1,0,0,0,232,0,0,0,4,0,0,0,240,0,0,0,1,0,0,0,16,1,0,0,156,1,0,0,48,1,0,0,118,1,0,0,126,1,0,0,129,1,0,0,142,1,0,0,165,1,0,0,185,1,0,0,205,1,0,0,208,1,0,0,212,1,0,0,216,1,0,0,237,1,0,0,253,1,0,0,3,2,0,0,8,2,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,9,0,0,0,6,0,0,0,5,0,0,0,0,0,0,0,7,0,0,0,5,0,0,0,104,1,0,0,8,0,0,0,5,0,0,0,112,1,0,0,4,0,2,0,12,0,0,0,1,0,0,0,0,0,0,0,1,0,2,0,11,0,0,0,2,0,1,0,13,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,29,2,0,0,0,0,0,0,1,0,1,0,1,0,0,0,17,2,0,0,4,0,0,0,112,16,3,0,0,0,14,0,3,0,1,0,2,0,0,0,22,2,0,0,8,0,0,0,98,0,0,0,19,1,45,0,110,32,2,0,16,0,14,0,1,0,0,0,0,0,0,0,1,0,0,0,6,0,6,60,105,110,105,116,62,0,1,73,0,11,76,102,97,99,116,111,114,105,97,108,59,0,21,76,106,97,118,97,47,105,111,47,80,114,105,110,116,83,116,114,101,97,109,59,0,18,76,106,97,118,97,47,108,97,110,103,47,79,98,106,101,99,116,59,0,18,76,106,97,118,97,47,108,97,110,103,47,83,121,115,116,101,109,59,0,1,86,0,2,86,73,0,2,86,76,0,19,91,76,106,97,118,97,47,108,97,110,103,47,83,116,114,105,110,103,59,0,14,102,97,99,116,111,114,105,97,108,46,106,97,118,97,0,4,109,97,105,110,0,3,111,117,116,0,7,112,114,105,110,116,108,110,0,2,0,7,14,0,14,1,0,7,14,120,0,0,0,2,0,0,128,128,4,176,2,1,9,200,2,0,13,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,14,0,0,0,112,0,0,0,2,0,0,0,7,0,0,0,168,0,0,0,3,0,0,0,3,0,0,0,196,0,0,0,4,0,0,0,1,0,0,0,232,0,0,0,5,0,0,0,4,0,0,0,240,0,0,0,6,0,0,0,1,0,0,0,16,1,0,0,1,32,0,0,2,0,0,0,48,1,0,0,1,16,0,0,2,0,0,0,104,1,0,0,2,32,0,0,14,0,0,0,118,1,0,0,3,32,0,0,2,0,0,0,17,2,0,0,0,32,0,0,1,0,0,0,29,2,0,0,0,16,0,0,1,0,0,0,44,2,0,0]
 

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

//parse(factorial_dex_data);

var output = document.getElementById('output')

var print = function(str) {
  //var p = document.createElement('p')
  output.appendChild(document.createTextNode(str+"\n"))
  //output.appendChild(p)
}

var DEX_FILE_MAGIC = [ 0x64, 0x65, 0x78, 0xa, 0x30, 0x33, 0x35, 0x00 ]
var ENDIAN_CONSTANT = 0x12345678
var REVERSE_ENDIAN_CONSTANT = 0x78563412

var read_section = function(name, file) {
  var size = file.get32()
  var offset = file.get32()

  print("Section \""+name+"\" size: 0x"+hex(size)+" offset: 0x"+hex(offset))
  
  return {
    count: size,
    offset: offset,
  }
}

var read_mutf8 = function(file) {
  var bytes = []
  while(1) {
    var c = file.get()
    if ( c === 0 )
      break
    bytes.push(c)
  }
  return String.fromCharCode.apply(null, bytes);
}

var parse_dex_types = function(file, strings, type_ids) {
  var i
  file.seek(type_ids.offset)
  var num_descriptors = type_ids.count
  
  types = []
  for(i=0; i<num_descriptors; i++) {
    types[i] = strings[file.get32()]
  }
  return types
}

var parse_dex_type_list = function(file, types, offset) {
  file.seek(offset)
  var count = file.get32()
  var i

  type_list = []
  for(i=0; i<count; i++) {
    type_list.push(types[file.get16()])
  }
  return type_list;
}

var parse_dex_protos = function(file, strings, types, proto_ids) {
  var i
  file.seek(proto_ids.offset)
  var num_protos = proto_ids.count

  protos = []
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
    protos[i].params = parse_dex_type_list(file, types, parameters_off);

  }

  return protos;
}

var parse_dex_strings = function(file, string_ids) {
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
    var str = read_mutf8(file)
    
    //--- mutf-8 scares me
    if(str.length !== len) {
      console.log("BAD STRING LENGTH? code-points: "+len + " strlen: "+str.length)
    }

    strings[i] = str
  }

  return strings
}

var parse_dex = function(byte_data) {
  var i, j
  var N = byte_data.length;

  var file = arrayFile(byte_data);

  //--- check magic number
  for(i=0; i<DEX_FILE_MAGIC.length; i++) {
    if(DEX_FILE_MAGIC[i] !== file.get()) {
      print("Error, DEX_FILE_MAGIC["+i+"] not found!\n")
      return
    }
  }
  print("DEX_FILE_MAGIC correct");

  //--- skip checksum?
  var checksum = file.get32()
  print("adler32 checksum: 0x" + hex(checksum))

  //--- SHA1 20 bytes
  var result=""
  for(i=0; i<20; i++) {
    result += hex(file.get())
  }
  print("SHA1: 0x" + result)

  var file_size = file.get32()
  print("file_size: " + file_size + " bytes, length="+N);
  if(file_size !== N) {
    print("file size not correct!")
  }
  
  var header_size = file.get32()
  print("header_size = 0x" + hex(header_size))

  var endian_tag = file.get32()
  print("ENDIAN_TAG = 0x" + hex(endian_tag))
  if(endian_tag !== ENDIAN_CONSTANT) {
    print("TODO need to do some sort of swapping with this file")
  }

  var link = read_section("link", file)

  var map_off = file.get32()
  print("Map offset=0x"+hex(map_off))
  
  var string_ids = read_section("string_ids", file)
  var type_ids = read_section("type_ids", file)
  var proto_ids = read_section("proto_ids", file)
  var field_ids = read_section("field_ids", file)
  var method_ids = read_section("method_ids", file)
  var class_defs = read_section("class_defs", file)
  var data = read_section("data", file)
  
  strings = parse_dex_strings(file, string_ids)
  for(i=0; i<strings.length; i++) {
    var s = strings[i]
    print("string["+i+"] len="+s.length+" data=\""+s+"\"")
  }

  var types = parse_dex_types(file, strings, type_ids)
  for(i=0; i<types.length; i++) {
    print("type["+i+"] = \""+types[i]+"\"");
  }

  var protos = parse_dex_protos(file, strings, types, proto_ids)
  for(i=0; i<protos.length; i++) {
    print("prototype \""+protos[i].shorty_descriptor+"\" "+
          "( " + protos[i].params.join(", ") + " ) -> " +
          protos[i].return_type+"")
  }

  //var fields = parse_dex_fields
}

parse_dex(factorial_dex_data)


