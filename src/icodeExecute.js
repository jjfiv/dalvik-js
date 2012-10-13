// icode is the "Internal or Interpreter Codes"

var icodeHandlers = {
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
assert(!isUndefined(icodeHandlers['static-get']), "static-get is defined test");


