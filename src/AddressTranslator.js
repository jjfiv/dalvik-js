//
// AddressTranslator
//
// Handles the conversion of offset addresses within certain icodes to
// index based addressing (into the icode array)
//

var translateAddresses = function(_icode) {

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
    {offset: 0, op: "goto", addrOffset: 7 },
    {offset: 5, op: "make-believe"},
    {offset: 7, op: "make-believe"},
    {offset: 10, op: "switch", src: 2, values: [0, 4, 5, 6, 7], addrOffsets: [5, 5, 7, 16, 22]},
    {offset: 12, op: "make-believe"},
    {offset: 14, op: "if", addrOffset: 19},
    {offset: 16, op: "make-believe"},
    {offset: 19, op: "goto", addrOffset: 14},
    {offset: 21, op: "make-believe"},
    {offset: 22, op: "make-believe"},
  ];

  //
  // This is like the output icode
  //
  var _testOutput = [
    /* 0 */{op: "goto", address: 2 },
    /* 1 */{op: "make-believe"},
    /* 2 */{op: "make-believe"},
    /* 3 */{op: "switch", src: 2, cases: [0, 4, 5, 6, 7], addresses: [1, 1, 2, 6, 9]},
    /* 4 */{op: "make-believe"},
    /* 5 */{op: "if", address: 7},
    /* 6 */{op: "make-believe"},
    /* 7 */{op: "goto", address: 5},
    /* 8 */{op: "make-believe"},
    /* 9 */{op: "make-believe"},
  ];
  assert(_testInput.length === _testOutput.length, "AddressTranslator: test data sanity length check");

  var _actOutput = translateAddresses(_testInput);

  assert(_actOutput.length === _testOutput.length, "AddressTranslator: Output length is as expected");
  
  for(_i=0; _i<_actOutput.length; _i++) {
    _in  = _testInput[_i];
    _act = _actOutput[_i];
    _exp = _testOutput[_i];
    
    // check goto or if translation
    if( !isUndefined(_exp.address) ) {
      assert(_exp.address === _act.address,
        "AddressTranslator: Expected address in " + _in + " to be resolved to " + _exp + "; but actually " + _act);
    }

    // check switch translation
    if( !isUndefined(_exp.addresses) ) {
      _eaddr = _exp.addresses;
      _aaddr = _act.addresses;

      assert(_eaddr.length === _aaddr.length,
             "AddressTranslator: Expected switch target lengths to be equivalent after translation!");

      for(_j = 0; _j<_eaddr.length; _j++) {
        assert(_eaddr[_j] === _aaddr[_j],
               "AddressTranslator: Expected address in " + _in + " to be resolved to " + _exp + "; but actually " + _act);
      }
    }
  }
 
}()); // end self-test




