// icode is the "Internal or Interpreter Codes"
// dependencies: icodeGen.js (needed to resolve values for keys), assert.js

var icodeHandlers = [];
icodeHandlers[moveFamilyIcode] = function(_inst, _thread){
    // move family values have two args
    if (DEBUG){
        assert(_inst.args.length===2 && _inst.args.argsize===2);        
    }
    var _destRegSize = _inst.argsize[0], _srcRegSize = _inst.argsize[1];
    //lookup in _actionMap is by srcRegSize, then destRegSize
    // I have these guys throwing things to detect errors, since they're bound to happen
    // in a hand-coded icodeGen.js
    var _actionMap = {
        32 : { 32 : function () { _thread.setRegister(_destAddr, _thread.getRegister(_srcAddr)); },
               64 : function () { throw "Cannot move from 32 bit register to 64 bit register."; }
             },
        64 : { 32 : function () { throw "Really cannot move from 64 bit register to 32 bit register."},
               64 : function () { _thread.setRegisterWide(_destAddr, _thread.getRegisterWide(_srcAddr)); }
             }
    };
    //note that move is like cp in that it does touch the contents at srcAddr
    try {
        actionMap[_srcRegSize][_destRegSize]();
    } catch (_x) {
        // do something?
    }
};
icodeHandlers[moveResultFamilyIcode] = function(_inst, _thread){
    // result codes depend on the final value of some execution, either invoke-* or an exception. 
    // We're assuming that the dex file has ordered these appropriately and so for now
    // we aren't checking that the types match
    var _destRegSize = _inst.argsize[0];
    var _value = function () {throw "Need to figure out how to grab the last computation and pass it in.";}();
    var _actionMap = {
        32 : function () { _thread.setRegister(_destAddr, _value); },
        64 : function () { _thread.setRegisterWide(_destAddr, _value); }
    };
    try{
        _actionMap[_destRegSize]();
    } catch (_x) {
        // do something?
    }
};


var icodeHandlers_old = {
  // handles returning from a method with or without a value
  "return": function(_inst, _thread) {
    var result;
    if(_inst.src) {
      result = _thread.getRegister(_inst.src);
      // TODO, also deal with wide
    }
    _thread.popMethod(result);
  },

  // handles invoking a method on an object or statically
  "invoke": function(_inst, _thread) {
    var kind = _inst.kind;
    var methodName = _inst.method;
    var argRegs = _inst.argumentRegisters;

    var argValues = argRegs.map(function (_id) { return _thread.getRegister(_id); });

    if(methodName === "Ljava/io/Printstream;.println") {
      
      console.log("print " + argValues[1] +
                  " to " + inspect(argValues[0]) + "!");

      terminal.println(argValues[1]);
    }
  },

  // handles loading a constant into a register
  // this can be a number, a string, a type, ...
  "move-const": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _inst.value);
  },

  // handles getting a static field from a class
  "static-get": function(_inst, _thread) {
    var dest = _inst.dest;

    var _field = FieldFromString(_inst.field);
    
    var _result = {};
    
    console.log(_field);
    // assume we're going to find something of the correct type
    // set to "null" initially --- TODO actual null?
    _result.type = _field.type;
    _result.value = 0;

    if(_field.definingClass === "Ljava/lang/System;" && _field.name === "out") {
      _result.value = "System.out";
    } else {
      assert(0, 'given field ' + _inst.field + ' could not be found!');
    }

    _thread.setRegister(dest, _result);
  },
};


// sanity check of usage
//assert(!isUndefined(icodeHandlers['static-get']), "static-get is defined test");


