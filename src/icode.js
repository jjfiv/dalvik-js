'use strict'
// icode is the "Internal or Interpreter Codes"

var icodeHandlers = {
  "return": function(_inst, _thread) {
    var result;
    if(_inst.src) {
      result = _thread.getRegister(_inst.src);
      // TODO, also deal with wide
    }
    _thread.popMethod(result)
  },
  "invoke": function(_inst, _thread) {
    var kind = _inst.kind;
    var methodName = _inst.method
    var argRegs = _inst.argumentRegisters

    var argValues = argRegs.map(function (_id) { return _thread.getRegister(_id); })

    if(methodName == "Ljava/io/Printstream;.println") {
      console.log("print " + argValues[1] + " to " + argValues[0] + "!")
      terminal.println(argValues[1])
    }
  },
  "move-const": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _inst.value);
  },
  "static-get": function(_inst, _thread) {
    var dest = _inst.dest;

    
    var value;
    if(_inst.field === "Ljava/lang/System;.out:Ljava/io/PrintStream;") {
      //value = {name: "Ljava/lang/System.out", type: "Ljava/io/PrintStream;"}
      value = "System.out"
    } else {
      assert(0, 'given field ' + _inst.field + ' could not be found!')
    }

    _thread.setRegister(dest, value);
  },
};

assert(!isUndefined(icodeHandlers['static-get']), "static-get is defined test");


