// icode is the "Internal or Interpreter Codes"
// dependencies: icodeGen.js (needed to resolve values for keys), assert.js, invoke.js

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
    var _value = _thread.getRegister (_inst.src);
    _thread.setRegister(_inst.dest, _value);
  },

  "move-result": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread._result);
  },

  "move-exception": function(_inst, _thread) {
    _thread.setRegister(_inst.dest, _thread._exception);
  },

  // handles returning from a method with or without a value
  "return": function(_inst, _thread) {
    _thread.popMethod(_thread.getRegister(_inst.value));
  },

  // handles loading a constant into a register
  // this can be a number, a string, a type, ...
  "move-const": function(_inst, _thread) {
    if(_inst.wide) {
      _thread.setRegister(_inst.dest, _inst.value);
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
    var _typeA = _thread.getRegister(_inst.src).type;
    var _typeB = _inst.type;
    assert(!_typeA.isPrimitive(), "check-cast should only be called on references");
    if (_typeA.isPrimitive() || !_typeA.isEquals(_typeB)){
      throw "ClassCastException";
    }      
  },

  "instance-of": function(_inst, _thread) {
    var _realSrc = _inst.dest, _realDest = _inst.src; //handling swap issue
    var _type = _inst.type;
    var _obj = _thread.getRegister(_realSrc);
    assert(_thread._vm.classLibrary.findClass(_obj.type), "Class "+_obj.getTypeString()+" not found.");
    assert(isA(_obj, 'Instance'), "Object "+inspect(_obj)+" is not an Instance");
    _thread.setRegister(_realDest, (!_type.isPrimitive() && (_obj.type.isEquals(_type))));
  },

  "array-length": function(_inst, _thread) {
    var _array = _thread.getRegister (_inst.dest);
    _thread.setRegister (_inst.dest, _array._data.length); 
  },

  "new-instance": function(_inst, _thread) {
    // get the class for the corresponding type from classLibrary
    var _class = _thread._vm.classLibrary.findClass(_inst.type);
    _thread.setRegister(_inst.dest, _class.makeNew());
    console.log("new-instance made: " + inspect(_thread.getRegister(_inst.dest)));
  },

  "new-array": function(_inst, _thread) {
    _thread.setRegister (_inst.dest, new newArray(_inst.dest, _inst.sizeReg, _inst.type));
    console.log("new-array made: " + inspect(_thread.getRegister(_inst.dest)));
  },

  "filled-new-array": function(_inst, _thread) {
    var _i;
    _inst.sizes = [];
    for (_i = 0; _i < _inst.dimensions; _i++) {
      _inst.sizes[_i] = _thread.getRegister (_inst.reg[_i]);
    }

    _thread._result = new newDimArray(_inst);
    console.log("filled-new-array made: " + inspect(_thread.getRegister(_inst.dest)));
  },

  "filled-new-array/range": function(_inst, _thread) {
    var _i;
    
    _inst.sizes = [];
    for (_i = 0; _i < _inst.dimensions; _i++) {
      _inst.sizes[_i] = _thread.getRegister (_inst.reg[_i]);
    }

    _thread._result = new newDimArray(_inst);
    console.log("filled-new-array/range made: " + inspect(_thread.getRegister(_inst.dest)));
  },

  "fill-array": function(_inst, _thread) {
    var _array = _thread.getRegister (_inst.dest);
    _array._data = _inst.data;
  },

  "throw": function(_inst, _thread) {
    NYI(_inst);
  },

  "goto": function(_inst, _thread) {
    return _inst.address;
  },

  "switch": function(_inst, _thread) {
    var _val = _thread.getRegister(_inst.src);    
    var _i, _addressJumpTo;
    for(_i=0; _i<_inst.cases.length; _i++) {
      if(_val === _inst.cases[_i]) {
        _addressJumpTo = _inst.addresses[_i];
        break;
      }
    }
    return _addressJumpTo;
  },

  "cmp": function(_inst, _thread) {
    var _srcA = _thread.getRegister (_inst.srcA);
    var _srcB = _thread.getRegister (_inst.srcB);

    if (_inst.type.isEquals(TYPE_FLOAT)) {
      _srcA = floatFromInt (_srcA);
      _srcB = floatFromInt (_srcB);
    }
    else if (_inst.type.isEquals(TYPE_DOUBLE)){
      _srcA = doubleFromgLong (_srcA);
      _srcB = doubleFromgLong (_srcB);
    }

    if (!(_inst.type.isEquals(TYPE_LONG))) {
      if ((isNaN(_srcA)) || (isNaN(_srcB))) {
        if (_inst.bias === "lt") {
          _thread.setRegister (_inst.dest, -1);
        }
        else {
          _thread.setRegister (_inst.dest, 1);
        }
        return;
      }
      if (_srcB < _srcA) {
        _thread.setRegister (_inst.dest, -1);
      }
      else if (_srcB > _srcA) {
        _thread.setRegister (_inst.dest, 1);
      }
      else {
        _thread.setRegister (_inst.dest, 0);
      }
    }
    else {
      if (_srcB.lessThan(_srcA)) {
        _thread.setRegister (_inst.dest, -1);
      }
      else if (_srcB.greaterThan(_srcA)) {
        _thread.setRegister (_inst.dest, 1);
      }
      else {
        _thread.setRegister (_inst.dest, 0);
      }
    }
  },

  "if": function(_inst, _thread) {
      var ifOp = _inst.cmp;
      var _varA = _thread.getRegister(_inst.varA);
      var _varB = 0;
      if(!isUndefined(_inst.varB)) {
        _varB = _thread.getRegister(_inst.varB);
      }
      if (ifOp === "eq") {
          if (_varA === _varB) {
              return _inst.address;
          }
      } else if (ifOp === "ne") {
          if (_varA !== _varB) {
              return _inst.address;
          }
      } else if (ifOp === "lt") {
          if (_varA < _varB) {
              return _inst.address;
          }
      } else if (ifOp === "ge") {
          if (_varA >= _varB) {
              return _inst.address;
          }
      } else if (ifOp === "gt") {
          if (_varA > _varB) {
              return _inst.address;
          }
      } else if (ifOp === "le") {
          if (_varA <= _varB) {
              return _inst.address;
          }
      } else {
          assert (false, "Undefined If Comparison operation");
      }
  },

  "array-get": function(_inst, _thread) {
    var _array = _thread.getRegister (_inst.array);
    var _index = _thread.getRegister (_inst.index);
    _thread.setRegister (_inst.value, _array._data[_index]);
  },

  "array-put": function(_inst, _thread) {
    var _array = _thread.getRegister (_inst.array);
    var _index = _thread.getRegister (_inst.index);
    var _value = _thread.getRegister (_inst.value);
    _array._data[_index] = _value;
  },

  "instance-get": function(_inst, _thread) {
    //var _obj = _thread.getRegister(_inst.obj);
    var _obj = _inst.obj;
	//var _obj = _thread._vm._source._dex _inst.obj
    console.log("instance _obj " + _obj);
    var _val, _i;
    
    for (_i in _obj.instanceFields) {
      console.log("_i " + _i);
      if (_i._name === _inst.field) {
        _val = _i.value;
        break;
      }
    }

    if (_val === undefined) {
      for (_i in _obj.staticFields) {
        console.log("_i " + _i);
        if (_i._name === _inst.field) {
          _val = _i.value;
          break;
        }
      }
    }
    //_thread.setRegister (_inst.value, _inst.field.value);
    _thread.setRegister (_inst.value, _val);
  },

  "instance-put": function(_inst, _thread) {
    _inst.field.value = _thread.getRegister (_inst.value);
  },

  // handles getting a static field from a class
  "static-get": function(_inst, _thread) {
    var dest = _inst.dest;
	//var dest = _thread.getRegister (_inst.dest);

    var _field = _inst.field;
    
    var _result = {};
    
    console.log(_field);
    // assume we're going to find something of the correct type
    // set to "null" initially --- TODO actual null?
    _result.primtype = _field.type;
    _result.value = 0;
	
    console.log(_field);

    // replace this with calls to ClassLibrary, and fallback to native
    if(_field.definingClass._typeString === "Ljava/lang/System;" && _field.name === "out") {
      _result.value = "System.out";
    } else {
      assert(0, 'given field ' + _inst.field.toString() + ' could not be found!');
    }
	
    console.log(_field);

    _thread.setRegister(dest, _result);
  },

  "static-put": function(_inst, _thread) {
    NYI(_inst);
  },

  // handles invoking a method on an object or statically
  "invoke": function(_inst, _thread) {
    invoke(_inst,_thread);
  },

  "negate": function(_inst, _thread) {
    var _src = _thread.getRegister (_inst.src);
    if (_inst.type.isEquals(TYPE_DOUBLE)) {
      _thread.setRegister (_inst.dest, gLongFromDouble (-doubleFromgLong (_src)));
    } else if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister (_inst.dest, _src.negate());
    } else if (_inst.type.isEquals(TYPE_FLOAT)) {
      _thread.setRegister (_inst.dest, intFromFloat(-floatFromInt(_src)));
    } else if (_inst.type.isEquals(TYPE_INT)) {
      _thread.setRegister (_inst.dest, -_src);
    } else {
      assert(false, "Invalid type for negate");
    }
  },

  "not": function(_inst, _thread) {
    var _src = _thread.getRegister (_inst.src);
    if (_inst.type.isEquals(TYPE_INT)) {
      _thread.setRegister (_inst.dest, ~_src);
    } else if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister (_inst.dest, _src.not());
    } else {
      assert(false, "Invalid type for not");
    }
  },

  "primitive-cast": function(_inst, _thread) {
    
	// Not distinguishing between wide and not wide
	var val = _thread.getRegister(_inst.src);
	
	if (_inst.srcType.isEquals(TYPE_FLOAT)) {
	  val = floatFromInt(val);
	} else if ( _inst.srcType.isEquals(TYPE_DOUBLE)) {
	  val = doubleFromgLong(val);
	} else {
	}
	
	if (_inst.srcType.isEquals(TYPE_LONG)) {
	  console.log("long to smth: " + val);
	  if (_inst.destType.isEquals(TYPE_INT)) {
	    val = val.toInt();
	  } else if (_inst.destType.isEquals(TYPE_FLOAT)) {
	    val = val.toNumber();
	    val = floatFromDouble(val);
	  } else if (_inst.destType.isEquals(TYPE_DOUBLE)) {
	    val = val.toNumber();
	  } else if (_inst.destType.isEquals(TYPE_LONG)) {
	  } else {
	    assert(false, "Unrecognized target type conversion from long"); 
	  }
	} else {
	  console.log("number to smth: " + val);
	  if (_inst.destType.isEquals(TYPE_INT)) {
	    val = parseInt(val.toString());
	  } else if (_inst.destType.isEquals(TYPE_FLOAT)) {
	    val = floatFromDouble(val);
	  } else if (_inst.destType.isEquals(TYPE_DOUBLE)) {
	  } else if (_inst.destType.isEquals(TYPE_LONG)) {
	    val = gLong.fromNumber(val);
	  } else {
	    assert(false, "Unrecognized target type conversion from int");
	  }
	}
	
	if (_inst.destType.isEquals(TYPE_INT) || _inst.destType.isEquals(TYPE_LONG)) {
	} else if (_inst.destType.isEquals(TYPE_FLOAT)) {
	  val = intFromFloat(val);
        } else if (_inst.destType.isEquals(TYPE_DOUBLE)) {
	  val = gLongFromDouble(val);
	} else {
	  assert(false, "Unidentified target primitive type");
	}
    
	_thread.setRegister(_inst.dest, val);
  },

  "int-cast": function(_inst, _thread) {
    var val = _thread.getRegister(_inst.src);
	var dstType = _inst.destType;
	var dst = _inst.dest;
	if (dstType.isEquals(TYPE_SHORT)) {
	  val = val & 0xFFFF;
	  val = signExtend(val, 16, 32);
	} else if (dstType.isEquals(TYPE_CHAR)) {
	  val = val & 0xFFFF;
	  console.log("val after 0x: " + val);
	  val = String.fromCharCode(val);
	} else if (dstType.isEquals(TYPE_BYTE)) {
	  val = val & 0xFF;
	  val = signExtend(val, 8, 32);
	} else {
	  assert(false, "Unrecognized target cast from int");
	}
	
	_thread.setRegister(dst, val);
  },

  "add": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    var result;
    if (_inst.type.isEquals(TYPE_DOUBLE)) {
      numA = doubleFromgLong (numA);
      numB = doubleFromgLong (numB);
      result = numA + numB;
      _thread.setRegister(_inst.dest, gLongFromDouble (result));
    } else if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.add(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA + numB));
    } else if (_inst.type.isEquals(TYPE_FLOAT)) {
      numA = floatFromInt (numA);
      numB = floatFromInt (numB);
      result = numA + numB;
      result = floatFromDouble (result);
      _thread.setRegister (_inst.dest, intFromFloat (result));
    } else {
      assert (false, "Unidentified type for addition");
    }
  },

  "sub": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    var result;
    if (_inst.type.isEquals(TYPE_DOUBLE)) {
      numA = doubleFromgLong (numA);
      numB = doubleFromgLong (numB);
      result = numA - numB;
      _thread.setRegister(_inst.dest, gLongFromDouble (result));
    } else if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.add(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA - numB));
    } else if (_inst.type.isEquals(TYPE_FLOAT)) {
      numA = floatFromInt (numA);
      numB = floatFromInt (numB);
      result = numA - numB;
      result = floatFromDouble (result);
      _thread.setRegister (_inst.dest, intFromFloat (result));
    } else {
      assert (false, "Unidentified type for subtraction");
    }
  },
  
  "mul": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    var result;
    if (_inst.type.isEquals(TYPE_DOUBLE)) {
      numA = doubleFromgLong (numA);
      numB = doubleFromgLong (numB);
      result = numA * numB;
      _thread.setRegister(_inst.dest, gLongFromDouble (result));
    } else if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.multiply(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA * numB));
    } else if (_inst.type.isEquals(TYPE_FLOAT)) {
      numA = floatFromInt (numA);
      numB = floatFromInt (numB);
      result = numA * numB;
      result = floatFromDouble (result);
      _thread.setRegister (_inst.dest, intFromFloat (result));
    } else {
      assert (false, "Unidentified type for multiplication");
    }
  },

  "div": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    var result;
    if (_inst.type.isEquals(TYPE_DOUBLE)) {
      numA = doubleFromgLong (numA);
      numB = doubleFromgLong (numB);
      result = numA / numB;
      _thread.setRegister(_inst.dest, gLongFromDouble (result));
    } else if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.div(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA / numB));
    } else if (_inst.type.isEquals(TYPE_FLOAT)) {
      numA = floatFromInt (numA);
      numB = floatFromInt (numB);
      result = numA / numB;
      result = floatFromDouble (result);
      _thread.setRegister (_inst.dest, intFromFloat (result));
    } else {
      assert (false, "Unidentified type for division");
    }
  },

  "rem": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    var result;
    if (_inst.type.isEquals(TYPE_DOUBLE)) {
      numA = doubleFromgLong (numA);
      numB = doubleFromgLong (numB);
      result = numA % numB;
      _thread.setRegister(_inst.dest, gLongFromDouble (result));
    } else if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.modulo(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA % numB));
    } else if (_inst.type.isEquals(TYPE_FLOAT)) {
      numA = floatFromInt (numA);
      numB = floatFromInt (numB);
      result = numA % numB;
      result = floatFromDouble (result);
      _thread.setRegister (_inst.dest, intFromFloat (result));
    } else {
      assert (false, "Unidentified type for getting a remainder");
    }
  },
    
  "and": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.and(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA & numB));
    } else {
      assert (false, "Unidentified type for an 'And' operation");
    }
  },

  "or": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.or(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA | numB));
    } else {
      assert (false, "Unidentified type for an 'Or' operation");
    }
  },

  "xor": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.xor(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA ^ numB));
    } else {
      assert (false, "Unidentified type for a 'Xor' operation");
    }
  },

  "shl": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.shiftLeft(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA << numB));
    } else {
      assert (false, "Unidentified type for Shifting Left");
    }
  },

  "shr": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.shiftRight(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA >> numB));
    } else {
      assert (false, "Unidentified type for Shifting Right");
    }
  },

  "ushr": function(_inst, _thread) {
    var numA = _thread.getRegister(_inst.srcA);
    var numB = _thread.getRegister(_inst.srcB);
    if (_inst.type.isEquals(TYPE_LONG)) {
      _thread.setRegister(_inst.dest, numA.shiftRightUnsigned(numB));
    } else if (_inst.type.isEquals(TYPE_BYTE) || _inst.type.isEquals(TYPE_INT) ||
        _inst.type.isEquals(TYPE_SHORT)) {
      _thread.setRegister(_inst.dest, _inst.type.trimNum(numA >>> numB));
    } else {
      assert (false, "Unidentified type for Unsigned Shifting Right");
    }
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

