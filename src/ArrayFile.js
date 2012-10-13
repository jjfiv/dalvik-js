// ArrayFile class
//
// wraps up an array of bytes into a file pointer style object
//

var ArrayFile = function(data) {
  this._data = data;
  this.offset = 0;
};

ArrayFile.prototype.eof = function() {
  return this.offset >= this._data.length || this.offset < 0;
};

ArrayFile.prototype.size = function() {
  return this._data.length;
};

ArrayFile.prototype.get = function() {
  return this._data[this.offset++];
};

// valid only for n <= 4
// otherwise byteswap becomes too complex
ArrayFile.prototype.getn = function(n) {
  var bytes = [];
  var i; 
  for(i=0; i<n; i++) {
    bytes.push(this.get());
  }

  bytes = bytes.reverse();

  var value = 0;
  for(i=0; i<n; i++) {
    value <<= 8;
    value |= bytes[i];
  }

  return value;
};

ArrayFile.prototype.get16 = function() {
  var i = this.offset;
  var d = this._data;

  this.offset += 2;

  // little endian
  return (d[i+1] << 8) | d[i];
};

ArrayFile.prototype.get32 = function() {
  var i = this.offset;
  var d = this._data;

  this.offset += 4;

  // little endian
  return (d[i+3] << 24) | (d[i+2] << 16) | (d[i+1] << 8) | d[i];
};

ArrayFile.prototype.getUleb128 = function() {
  var file = this;
  return uleb128(function() { return file.get(); });
};

ArrayFile.prototype.getSleb128 = function() {
  var file = this;
  return sleb128(function() { return file.get(); });
};

//
// MUTF-8; an encoding of UTF-16 in a null terminated manner.
//
// Binary:                    -> Meaning/Unicode point
// -----------------------------------------------------
// 00000000                   -> end of string
// 0xxxxxxx                   -> 1-0x7f
// 110xxxxx 01xxxxxx          -> 0x80-0x7ff
// 1110xxxx 01xxxxxx 01xxxxxx -> 0x800-0xffff
//
// This was reverse-engineered from the dex spec and wikipedia's article on UTF-8
//
ArrayFile.prototype.getMUTF8 = function() {
  var bytes = [];
  var c, cur;
  
  while(true) {
    c = this.get();

    if ( c === 0 ) {
      break;
    }

    // 2 or 3-byte code
    if((c & 0x80) !== 0) {
      if((c & 0x20) === 0) { // 2-byte code
        cur = (c & 0x1f) << 6;
        cur |= (this.get() & 0x3f);
      } else {
        assert( (c & 0x10) === 0, "Should be a start of three byte code");
        cur = (c & 0xf) << 12;
        cur |= (this.get() & 0x3f);
        cur |= (this.get() & 0x3f);
      }
    }
    bytes.push(c);
  }
  return String.fromCharCode.apply(null, bytes);
};

ArrayFile.prototype.seek = function(new_offset) {
  this.offset = new_offset;
};


