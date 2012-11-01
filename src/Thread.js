// Thread.js -> also contains StackFrame object
// dependencies: icodeExecute.js

var StackFrame = function(_m) {
  var _i;

  //--- public members
  this.regs = [];
  this.pc = 0;
  this.method = _m;

  for(_i=0; _i<_m.numRegisters; _i++) {
    this.regs[_i] = 0;
  }
};

// StackFrame.prototype.toString = function() {
//   var _i, _regs=" ";
//   var _pc = this.pc;
//   var _method = this.method.name;
//   var _opcode = this.method.icode[_pc].op;
//   for (_i=0 ; _i<this.regs.length ; _i++){
//     _regs+=this.regs[_i].toString()+" ";
//   }
//   return "{ PC:"+_pc+"\t\tMETHOD:"+_method+"\t\tOPCODE:"+_opcode+"\t\tREGS:["+_regs+"] }";
// };

var Thread = function(_vm, _state, _threadClass) {
  this._result = null;
  this._exception = null;
  this._vm = _vm;
  this._stack = [];
  this.state = _state || 'NEW';
  this.uid = gensym("T");
  this.threadClass = _threadClass;
};

Thread.prototype.spawn = function (_threadClass) {
  var newThread = new Thread(this._vm, 'NEW', _threadClass);
  this._vm._threads.push(newThread);
  return newThread;
};

Thread.prototype.getClassLibrary = function () {
  return this._vm.classLibrary;
};

// Thread.prototype.toString = function(){
//   return this._stack[0].toString()+"...";
// };

Thread.prototype.pushMethod = function(_m, _regs) {
  var _frame = new StackFrame(_m);
  // TODO load up regs with arguments; I think we need to do this backwards?
  if (_regs) { _frame.regs = _regs; }
  this._stack.push(_frame);
};

// param _result is null if no return value
Thread.prototype.popMethod = function(_result) {
  this._result = _result;
  this._stack.pop();
};


// grab the current frame object
Thread.prototype.currentFrame = function() {
  var _s = this._stack;
  var _len = _s.length;

  // this assert may be too paranoid eventually
  assert(_len !== 0, "Looking for non-existent stack frame!");

  return _s[_len-1];
}; //ends currentFrame

// a thread is done execution when all its methods return
// so when the frame stack is empty
Thread.prototype.isFinished = function() {
  return this.state !== 'NEW' && (this._stack.length === 0 || this.state === 'TERMINATED');
};

Thread.prototype.getRegister = function(_idx) {
  return this.currentFrame().regs[_idx];
}; //ends getRegister


Thread.prototype.setRegister = function(_idx, _value) {
  this.currentFrame().regs[_idx] = _value;
}; //ends setRegister

Thread.prototype.throwException = function(_obj) {
  var type = _obj.type; //TODO, have instances designed

  // find current method
  // find list of catches
  // find first match
  // frame.pc = firstMatch.pc
  // assert(nextInstruction == "move-exception")
}; //ends throwException

// do the next instruction
Thread.prototype.doNextInstruction = function() {
  //console.log(this.statusString());
  this.showStack();
  if (this.state === 'RUNNABLE'){
    var _frame = this.currentFrame();
    var _inst = _frame.method.icode[_frame.pc];
    var _handler = icodeHandlers[_inst.op];

    if(isUndefined(_handler)) {
      assert(0, "UNSUPPORTED OPCODE! " + _inst.op);
    }

    console.log('execute ' + _inst.op);
    var _inc = _handler(_inst, this);
    _frame.pc += (isUndefined(_inc)) ? 1 : _inc;

  } else {
    console.log('Thread '+this.uid+' not executing; currently state is '+this.state);
  }
};

Thread.prototype.showStack = function() {
  console.log('Thread ' + this.uid);

  // convert it to information, and reverse it so it's top first going to bottom
  var stackInfo = this._stack.map(function (_f) {
    return _f.method.toString() + " pc: " + _f.pc;
  }).reverse();

  var i;
  for(i=0; i<stackInfo.length; i++) {
    console.log("  "+stackInfo[i]);
  }
}

// summarize where we are
Thread.prototype.statusString = function() {

  if(this.isFinished()) {
    return "Thread terminated";
  }

  var _f = this.currentFrame();

  return "Thread " + this.uid + " in " + _f.method.toString() +
         "\n  pc=" + _f.pc +
         "\n  nextInstr=" + _f.method.icode[_f.pc].op +
         "\n  regs: " + inspect(_f.regs);
}; //ends statusString



