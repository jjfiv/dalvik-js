// global.js
// dependencies : assert.js
// Contains functions useful at the global level concerning classes and types.
// 
// While I know we can access a lot of this stuff using enumerable, I wanted documentation.
// I also wanted something that could be easily accessed in the repl while debugging.
//
// For classes, if a field is without an underscore, it is public. If it has an underscore, this means it is private.
// Private vars should only be accessed directly inside the scope in which they are defined.
// Otherwise, all private fields are accessible via a getter.
//
// VM, Upload, and ClassChooser are not included.


//VMClasses is really for human consumption
var VMClasses = {
  Class : { 
    type : 'Type', 
    accessFlags : 'int',
    parent : 'Type',
    interfaces : ['Type'],
    staticFields : ['Field'],
    instanceFields : ['Field'],
    directMethods : ['Method'],
    virtualMethods : ['Method']
  },
  ClassLibrary : {
    classes : ['Class']    
  },
  Exception : {
    // to do  
  },
  Field : {
    name : 'string',
    type : 'Type',
    definingClass : 'Type',
    accessFlag : 'int',
    value : '*'
  },
  Instance : {
    type : 'Type',
    fields : ['Field']
  },
  Method : {
    signature : 'MethodSignature',
    definingClass : 'Type',
    numRegisters : 'int',
    accessFlags : 'int',
    icode : ['object']
  },
  MethodSignature : {
    name : 'string',
    returnType : 'Type',
    parameterTypes : ['Type'],
    parameterAmount : 'int'
  },
  StackFrame : {
    regs : [], //untyped array - this can hold primitives or refs
    pc : 'int',
    method : 'Method'
  },
  Thread : {
    _result : '*',
    _exception : 'Exception',
    _vm : 'VM',
    _stack : ['StackFrame']
  },
  Type : {
    _typeString : 'string',
    _arrayDim : 'int',
    _type : 'string',
    _wide : 'boolean',
    _name : 'string'
  }
};

var index = {
  accessFlags : { type : 'int', set : ['Class', 'Field', 'Method'] },
  _arrayDim : { type : 'int', set : ['Thread'] },
  classes : { type : ['Class'], set : ['ClassLibrary'] },
  directMethods : { type : ['Method'], set : ['Class'] },
  definingClass : { type : 'Type', set : ['Field', 'Method'] },
  _exception : { type : 'Exception', set : ['Thread'] },
  fields : { type : ['Fields'], set : ['Instance'] },
  icode : { type : 'object', set : ['Method'] },
  instanceFields : { type : ['Field'], set : ['Class'] },
  interfaces : { type : ['Type'], set : ['Class'] },
  method : { type : ['Method'], set : ['StackFrame'] },
  name : { type : 'string', set : ['Field', 'MethodSignature'] },
  _name : { type : 'string', set : ['Thread'] },
  numRegisters : { type : 'int', set : ['Method'] },
  parameterAmount : { type : 'int', set : ['MethodSignature'] },
  parameterTypes : { type : ['Type'], set : ['MethodSignature'] },
  parent : { type : 'Type', set : ['Class'] },
  pc : { type : 'int', set : ['StackFrame'] },
  regs : { type : [] , set : ['StackFrame'] },
  _result : { type : '*' , set : ['Thread'] },
  returnType : { type : 'object', set : ['MethodSignature'] },
  signature : { type : 'MethodSignature', set : ['Method'] },
  _stack : { type : ['StackFrame'], set : ['Thread'] },
  staticFields : { type : ['Field'], set : ['Class'] },
  type : { type : 'Type', set : ['Class', 'Field', 'Instance'] },
  _type : { type : 'string', set : ['Type'] },
  _typeString : { type : 'string', set : ['Type'] },
  virtualMethods : { type : ['Method'], set : ['Class'] },
  value : { type : '*', set : ['Field'] },
  _vm : { type : 'VM', set : ['Thread'] },
  _wide : { type : 'boolean', set : ['Type'] }
};

var isA = function(_thing, _class){
  // _thing is an object whose class we are trying to discern
  // _class is a string naming the target class
  var _target = VMClasses[_class];
  assert(!isUndefined(_target), "Unrecognized class: "+_class);
  return _target.reduce(function(_p1, _p2) { return _thing.hasOwnProperty(_p1) && _thing.hasOwnProperty(_p2); });
};