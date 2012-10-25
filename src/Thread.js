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

StackFrame.prototype.toString = function() {
  var _i, _regs=" ";
  var _pc = this.pc;
  var _method = this.method.name;
  var _opcode = this.method.icode[_pc].op;
  for (_i=0 ; _i<this.regs.length ; _i++){
    _regs+=this.regs[_i].toString()+" ";
  }
  return "{ PC:"+_pc+"\t\tMETHOD:"+_method+"\t\tOPCODE:"+_opcode+"\t\tREGS:["+_regs+"] }";
};

var Thread = function(vm) {
  this._result = null;
  this._vm = vm;
  this._stack = [];
};

Thread.prototype.toString = function(){
  return this._stack[0].toString()+"...";
};

Thread.prototype.pushMethod = function(_m, _regs) {
  var _frame = new StackFrame(_m);
  // TODO load up regs with arguments; I think we need to do this backwards?
  if (_regs) { _frame.regs = _regs; }
  this._stack.push(_frame);
};

// param _result is optional
Thread.prototype.popMethod = function(_result) {
  if(!isUndefined(_result)) {
    this.setResult(_result);
  }

  this._stack.pop();
};

// a thread is done execution when all its methods return
// so when the frame stack is empty
Thread.prototype.isFinished = function() {
  return this._stack.length === 0;
};

// grab the current frame object
Thread.prototype.currentFrame = function() {
  var _s = this._stack;
  var _len = _s.length;

  // this assert may be too paranoid eventually
  assert(_len !== 0, "Looking for non-existent stack frame!");

  return _s[_len-1];
}; //ends currentFrame

Thread.prototype.getRegister = function(_idx) {
  return this.currentFrame().regs[_idx];
}; //ends getRegister

Thread.prototype.getRegisterWide = function(_idx){
  return [this.currentFrame().regs[_idx], this.currentFrame().regs[_idx+1]];
}

Thread.prototype.setRegister = function(_idx, _value) {
  this.currentFrame().regs[_idx] = _value;
}; //ends setRegister

Thread.prototype.setRegisterWide = function(_idx, _value){
  // TODO: need to implement function to parse out upper 32 and lower 32 bits of 62-bit _value
  this.currentFrame().regs[_idx]=upperWide(_value);
  this.currentFrame().regs[_idx+1]=lowerWide(_value);
}

Thread.prototype.setResult = function(_value) {
  this.result = _value;
};

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
  console.log(this.statusString());

  var _frame = this.currentFrame();
  var _inst = _frame.method.icode[_frame.pc];
  if (DEBUG){
      ICODES.putICODE(_inst.op);
  }

  // see icode.js
  var _handler = icodeHandlers[_inst.op];

  if(isUndefined(_handler)) {
    assert(0, "UNSUPPORTED OPCODE! " + _inst.op);
  }

  console.log('execute ' + _inst.op);
  var _inc = _handler(_inst, this);
  _frame.pc += (isUndefined(_inc)) ? 1 : _inc;
};

// summarize where we are
Thread.prototype.statusString = function() {
  if(this.isFinished()) {
    return "Thread terminated";
  }

  var _f = this.currentFrame();
  
  return "in " + _f.method.toStr() +
         "\n  pc=" + _f.pc +
         "\n  nextInstr=" + _f.method.icode[_f.pc].op +
         "\n  regs: " + inspect(_f.regs);
}; //ends statusString



