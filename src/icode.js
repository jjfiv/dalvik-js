'use strict'
// icode is the "Internal or Interpreter Codes"

var icodeHandlers = {
  "return": function(_inst, _thread) {
    var _thisFrame = _thread.stack.pop();
    if(_inst.src) {
    // TODO, also deal with wide
    // vm.SetResult(vm.getRegister(inst.src))
    }
  },
  "invoke": function(_inst, _thread) {

  },
  "move-const": function(_inst, _thread) {

  },
  "static-get": function(_inst, _thread) {
    
  },
}


