// icode is the "Internal or Interpreter Codes"
// dependencies: icodeGen.js (needed to resolve values for keys), assert.js

// NYI or "Not Yet Implemented"
var NYI = function(_inst) {
  console.log("Instruction " + _inst.op + " from Dalvik '"+_inst.dalvikName+"' not yet implemented.");
  throw "Not Implemented";
};

var icodeHandlers = {
  "nop": function(_inst, _thread) {
    // does nothing
  },
  
  "move": function(_inst, _thread) {
    NYI(_inst);
  },

  "move-result": function(_inst, _thread) {
    NYI(_inst);
  },

  "move-exception": function(_inst, _thread) {
    NYI(_inst);
  },

  // handles returning from a method with or without a value
  "return": function(_inst, _thread) {
    var result;
    if(_inst.src) {
      result = _thread.getRegister(_inst.src);
      // TODO, also deal with wide
    }
    _thread.popMethod(result);
  },

  // handles loading a constant into a register
  // this can be a number, a string, a type, ...
  "move-const": function(_inst, _thread) {
    if(_inst.wide) {
      NYI(_inst);
    } else {
      _thread.setRegister(_inst.dest, _inst.value);
    }
  },

  "monitor-enter": function(_inst, _thread) {
    NYI(_inst);
  },

  "monitor-exit": function(_inst, _thread) {
    NYI(_inst);
  },

  "check-cast": function(_inst, _thread) {
    NYI(_inst);
  },

  "instance-of": function(_inst, _thread) {
    NYI(_inst);
  },

  "array-length": function(_inst, _thread) {
    NYI(_inst);
  },

  "new-instance": function(_inst, _thread) {
    NYI(_inst);
  },

  "new-array": function(_inst, _thread) {
    NYI(_inst);
  },

  "fill-array": function(_inst, _thread) {
    NYI(_inst);
  },

  "throw": function(_inst, _thread) {
    NYI(_inst);
  },

  "goto": function(_inst, _thread) {
    NYI(_inst);
  },

  "switch": function(_inst, _thread) {
    NYI(_inst);
  },

  "cmp": function(_inst, _thread) {
    NYI(_inst);
  },

  "if": function(_inst, _thread) {
    NYI(_inst);
  },

  "array-get": function(_inst, _thread) {
    NYI(_inst);
  },

  "array-put": function(_inst, _thread) {
    NYI(_inst);
  },

  "instance-get": function(_inst, _thread) {
    NYI(_inst);
  },

  "instance-put": function(_inst, _thread) {
    NYI(_inst);
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

    // replace this with calls to ClassLibrary, and fallback to native
    if(_field.definingClass === "Ljava/lang/System;" && _field.name === "out") {
      _result.value = "System.out";
    } else {
      assert(0, 'given field ' + _inst.field + ' could not be found!');
    }

    _thread.setRegister(dest, _result);
  },

  "static-put": function(_inst, _thread) {
    NYI(_inst);
  },

  // handles invoking a method on an object or statically
  "invoke": function(_inst, _thread) {
    var kind = _inst.kind;
    var methodName = _inst.method;
    var argRegs = _inst.argumentRegisters;

    // convert given argument registers into the values of their registers
    var argValues = argRegs.map(function (_id) { return _thread.getRegister(_id); });

    //TODO handle more than just this method;
    //     will need to call into ClassLibrary to find things
    if(methodName === "Ljava/io/Printstream;.println") {
      
      console.log("print " + argValues[1] +
                  " to " + inspect(argValues[0]) + "!");

      terminal.println(argValues[1]);
    }
  },

  "negate": function(_inst, _thread) {
    NYI(_inst);
  },

  "not": function(_inst, _thread) {
    NYI(_inst);
  },

  "primitive-cast": function(_inst, _thread) {
    NYI(_inst);
  },

  "int-cast": function(_inst, _thread) {
    NYI(_inst);
  },

  "add": function(_inst, _thread) {
    NYI(_inst);
  },

  "sub": function(_inst, _thread) {
    NYI(_inst);
  },
  
  "mul": function(_inst, _thread) {
    if (_inst.type === TYPE_DOUBLE) {
	  assert(false, "Multiplying a Double is not high priority");
      NYI(_inst);
	} else if (_inst.type === TYPE_LONG) {
	  var numA = _thread.getRegister(_inst.srcA);
	  var numB = _thread.getRegister(_inst.srcB);
	  _thread.setRegister(_inst.dest, numA.multiply(numB));
	} else if (_inst.type === TYPE_BYTE || _inst.type === TYPE_INT || _inst.type === TYPE_CHAR ||
	           _inst.type === TYPE_SHORT || _inst.type === TYPE_FLOAT ) {
	  var numA = _thread.getRegister(_inst.srcA);
	  var numB = _thread.getRegister(_inst.srcB);
	  _thread.setRegister(_inst.dest, numA * numB);
	} else {
	  assert (false, "Unidentified type for multiplication");
	}
  },

  "div": function(_inst, _thread) {
    NYI(_inst);
  },

  "rem": function(_inst, _thread) {
    NYI(_inst);
  },

  "and": function(_inst, _thread) {
    NYI(_inst);
  },

  "or": function(_inst, _thread) {
    NYI(_inst);
  },

  "xor": function(_inst, _thread) {
    NYI(_inst);
  },

  "shl": function(_inst, _thread) {
    NYI(_inst);
  },

  "shr": function(_inst, _thread) {
    NYI(_inst);
  },

  "ushr": function(_inst, _thread) {
    NYI(_inst);
  },

  "add-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) + _inst.literal);
  },

  "sub-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) - _inst.literal);
  },
  
  "mul-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) * _inst.literal);
  },

  "div-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) / _inst.literal);
  },

  "rem-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) % _inst.literal);
  },

  "and-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) & _inst.literal);
  },

  "or-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) | _inst.literal);
  },

  "xor-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) ^ _inst.literal);
  },

  "shl-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) << _inst.literal);
  },

  "shr-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) >> _inst.literal);
  },

  "ushr-lit": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread.getRegister(_inst.src) >>> _inst.literal);
  }
};


// sanity check of usage
//assert(!isUndefined(icodeHandlers['static-get']), "static-get is defined test");


