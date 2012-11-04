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

Thread.prototype.pushMethod = function(_m, _regs) {
  var _frame = new StackFrame(_m);
  if (_regs) { _frame.regs = _regs; }
  this._stack.push(_frame);
};

Thread.prototype.popMethod = function(_result) {
  this._result = _result;
  this._stack.pop();
};

Thread.prototype.currentFrame = function() {
  var _s = this._stack;
  var _len = _s.length;

  // this assert may be too paranoid eventually
  assert(_len !== 0, "Looking for non-existent stack frame!");

  return _s[_len-1];
}; 

// a thread is done execution when all its methods return
// so when the frame stack is empty
Thread.prototype.isFinished = function() {
  return this.state !== 'NEW' && (this._stack.length === 0 || this.state === 'TERMINATED');
};

Thread.prototype.getRegister = function(_idx) {
  return this.currentFrame().regs[_idx];
}; 

Thread.prototype.setRegister = function(_idx, _value) {
  this.currentFrame().regs[_idx] = _value;
}; 

Thread.prototype.throwException = function(exceptionObj) {
  if (this._stack.length === 0){
    throw "Uncaught Java Exception: " + exceptionObj;
  }
  var newPC;
  var type = exceptionObj.type;
  var frame = this.currentFrame();
  var listOfCatches = frame.method.tryInfo.filter(function(_tr) { return -1 !== _tr.findAddressForType(frame.pc, type); });
  assert(listOfCatches.length<=1, "There oughtn't be more than one catch block that covers this thing.");
  this._exception = exceptionObj;
  if (listOfCatches[0]){
    newPC = listOfCatches[0].findAddressForType(frame.pc, type); // type: int
    assert(newPC!==-1, 'Die H&#228;rder.');
    frame.pc = newPC;
  } else {
    this.popMethod();
    this.throwException(exceptionObj);
  }
}; 

Thread.prototype.doNextInstruction = function() {
  if (this.state === 'RUNNABLE'){
    //this.showStack();
    var _frame = this.currentFrame();
    var _inst = _frame.method.icode[_frame.pc];
    var _handler = icodeHandlers[_inst.op];

    if(isUndefined(_handler)) {
      assert(0, "UNSUPPORTED OPCODE! " + _inst.op);
    }

    this._vm.logIcode(_inst.dalvikName);

    //console.log('execute ' + _inst.op);
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
    return _f.method.toString()
    + " pc: " + _f.pc + 
      " regs: " + _f.regs;
  }).reverse();

  var i;
  for(i=0; i<stackInfo.length; i++) {
    console.log("  "+stackInfo[i]);
  }
};

Thread.prototype.statusString = function() {

  if(this.isFinished()) {
    return "Thread terminated";
  }

  var _f = this.currentFrame();

  return "Thread " + this.uid + " in " + _f.method.toString() +
         "\n  pc=" + _f.pc +
         "\n  nextInstr=" + _f.method.icode[_f.pc].op +
         "\n  regs: " + inspect(_f.regs);
}; 
