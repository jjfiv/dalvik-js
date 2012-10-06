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
    }
  },
  "move-const": function(_inst, _thread) {

  },
  "static-get": function(_inst, _thread) {
    return 1;
  },
};

assert(!isUndefined(icodeHandlers['static-get']), "static-get is defined test");


