'use strict'
// icode is the "Internal or Interpreter Codes"

var icode = {
  "return": function(inst, vm) {
    var this_frame = vm.stack.pop();
    if(inst.src) {
    // TODO, also deal with wide
    // vm.SetResult(vm.getRegister(inst.src))
    }
  },
  "invoke": function(inst, vm) {

  },
  "move-const": function(inst, vm) {

  },
  "static-get": function(inst, vm) {
    
  },
}



