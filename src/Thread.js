'use strict'

var StackFrame = function(_m) {
  var _i;

  //--- public members
  this.regs = []
  this.pc = 0
  this.method = _m;

  for(_i=0; _i<_m.numRegisters; _i++) {
    _frame.regs[_i] = 0;
  }
}


var Thread = function() {
  this._result = null
  this._stack = []
}

Thread.prototype.pushMethod = function(_m) {
  var _frame = new StackFrame(_m)

  // TODO load up regs with arguments; I think we need to do this backwards?

  this._stack.push(_frame);
} //ends pushMethod

// param _result is optional
Thread.prototype.popMethod = function(_result) {
  if(!isUndefined(_result)) {
    this.setResult(_result);
  }

  this.stack.pop()
}

// a thread is done execution when all its methods return
// so when the frame stack is empty
Thread.prototype.isFinished = function() {
  return this.stack.length === 0
}

// grab the current frame object
Thread.prototype.currentFrame = function() {
  var _s = this.stack;
  var _len = _s.length;

  // this assert may be too paranoid eventually
  assert(_len !== 0, "Looking for non-existent stack frame!")

  return _s[_len-1]
} //ends currentFrame

Thread.prototype.getRegister = function(_idx) {
  return this.currentFrame().regs[_idx]
} //ends getRegister

Thread.prototype.setRegister = function(_idx, _value) {
  this.currentFrame().regs[_idx] = _value
} //ends setRegister

Thread.prototype.setResult = function(_value) {
  result = _value;
}

Thread.prototype.throwException = function(_obj) {
  var type = _obj.type; //TODO, have instances designed

  // find current method
  // find list of catches
  // find first match
  // frame.pc = firstMatch.pc
  // assert(nextInstruction == "move-exception")
} //ends throwException

// do the next instruction
Thread.prototype.doNextInstruction = function() {
  terminal.println(this.statusString())

  var _frame = this.currentFrame()
  var _inst = _frame.method.icode[_frame.pc]

  // see icode.js
  var _handler = icodeHandlers[_inst.op];

  if(isUndefined(_handler)) {
    assert(0, "UNSUPPORTED OPCODE!");
  }

  var _inc = _handler(_inst, this);
  _frame.pc += (isUndefined(_inc)) ? 1 : _inc;
}

// summarize where we are
Thread.prototype.statusString = function() {
  if(this.isFinished()) {
    return "Thread terminated"
  }

  var _f = this.currentFrame()
  return "in " + _f.method.name + " pc=" + _f.pc + " nextInstr=" + _f.method.icode[_f.pc] + " regs: " + _f.regs
} //ends statusString



