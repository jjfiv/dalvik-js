//
// AddressTranslator
//
// Handles the conversion of offset addresses within certain icodes to
// index based addressing (into the icode array)
//

//
// takes an array of offsets and returns a function
// that takes an offset as input and an index as output
//
var makeAddressConverter = function(_offset) {
  return function(_addr) {
    var _i; 
    for(_i=0; _i<_offset.length; _i++) {
      // return the first icode address whose offset is greater than or equal to the input bytecode address
      if(_offset[_i] >= _addr) {
        return _i;
      }
    }
    assert(false, "Converting the addresses in failed input translation: " + inspect(_offset) + " input: " + _addr);
  };
};


//
// A list of icodes, which may or may not contain addrOffset or addrOffsets parameters to be translated based on the _offsets array.
//
var translateAddresses = function(_icode, _offsets) {
  // make sure input lengths are good
  assert(_icode.length === _offsets.length, "translateAddresses: Translation array is not consistent with _icode array!");

  var _convertAddress = makeAddressConverter(_offsets);
  var _convertRelativeAddress = function(_relAddr, _index) {
    console.log("convert relative address: " + _relAddr + " from " + _offsets[_index]);
    console.log("abs address: " + (_relAddr + _offsets[_index]));
    // convert to absolute address for translation, then back to relative after
    return _convertAddress(_relAddr + _offsets[_index]) - _i;
  };
  
  // we need an index to convert from relative addressing
  var _i = 0;
  return _icode.map(function(_inst) {
    
    if(!isUndefined(_inst.addrOffset)) {
      _inst.address = _convertRelativeAddress(_inst.addrOffset, _i);
      delete _inst.addrOffset;
    }
    if(!isUndefined(_inst.addrOffsets)) {
      _inst.addresses = _inst.addrOffsets.map(function(_addrOffset) {
        return _convertRelativeAddress(_addrOffset,_i);
      });
      delete _inst.addrOffsets;
    }

    _i++;
    return _inst;
  });
};

// self-test
(function(){
  var _i, _j;
  var _in, _exp, _act;
  var _eaddr, _aaddr;

  //
  // This is like the input icode
  //
  var _testInput = [
    /*  0 */ {op: "goto", addrOffset: 7 },
    /*  5 */ {op: "make-believe"},
    /*  7 */ {op: "make-believe"},
    /* 10 */ {op: "switch", src: 2, values: [0, 4, 5, 6, 7], addrOffsets: [-5, -5, -3, 6, 12]},
    /* 12 */ {op: "make-believe"},
    /* 14 */ {op: "if", addrOffset: 5},
    /* 16 */ {op: "make-believe"},
    /* 19 */ {op: "goto", addrOffset: -5},
    /* 21 */ {op: "make-believe"},
    /* 22 */ {op: "make-believe"},
  ];

  // this is the dalvik address to icode address translation table
  var _testOffsets = [ 0, 5, 7, 10, 12, 14, 16, 19, 21, 22 ];

  //
  // This is like the output icode
  //
  var _testOutput = [
    /* 0 */ {op: "goto", address: 2 },
    /* 1 */ {op: "make-believe"},
    /* 2 */ {op: "make-believe"},
    /* 3 */ {op: "switch", src: 2, cases: [0, 4, 5, 6, 7], addresses: [-2, -2, -1, 3, 6]},
    /* 4 */ {op: "make-believe"},
    /* 5 */ {op: "if", address: 7},
    /* 6 */ {op: "make-believe"},
    /* 7 */ {op: "goto", address: 5},
    /* 8 */ {op: "make-believe"},
    /* 9 */ {op: "make-believe"},
  ];
  assert(_testInput.length === _testOutput.length, "AddressTranslator: test data sanity length check");

  var _actOutput = translateAddresses(_testInput, _testOffsets);

  assert(_actOutput.length === _testOutput.length, "AddressTranslator: Output length is as expected");
  
  for(_i=0; _i<_actOutput.length; _i++) {
    _in  = _testInput[_i];
    _act = _actOutput[_i];
    _exp = _testOutput[_i];
    
    // check goto or if translation
    if( !isUndefined(_exp.address) ) {
      assert(_exp.address === _act.address,
        "AddressTranslator: Expected address in " + inspect(_in) + " to be resolved to " + inspect(_exp) + "; but actually " + inspect(_act));
    }

    // check switch translation
    if( !isUndefined(_exp.addresses) ) {
      _eaddr = _exp.addresses;
      _aaddr = _act.addresses;

      assert(_eaddr.length === _aaddr.length,
             "AddressTranslator: Expected switch target lengths to be equivalent after translation!");

      for(_j = 0; _j<_eaddr.length; _j++) {
        assert(_eaddr[_j] === _aaddr[_j],
               "AddressTranslator: Expected address in " + inspect(_in) + " to be resolved to " + inspect(_exp) + "; but actually " + inspect(_act));
      }
    }
  }
 
}()); // end self-test




