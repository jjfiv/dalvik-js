'use strict';

//--- the two methods in here are junk, just to mock up what I think will need to happen "Object.equals" and "String.length"


// map of classes first
var native = {
  "Ljava/lang/Object" : {
    "equals": function(vm) {
      // todo, this is some kind of pointer comparison?
      vm.setResult(vm.getRegister(0) === vm.getRegister(1));
    }
  },
  "Ljava/lang/String" : {
    "length": function(vm) {
      vm.setResult(vm.getRegister(0).strData.length);
    }
  },
};

var nativeFields = {};


