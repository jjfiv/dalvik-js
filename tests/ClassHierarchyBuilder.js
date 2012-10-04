'use strict'

//
// This module links virtual method calls to the actual code in a parent class
//

function findDirectMethod(currentClass, methodName) {

  var methodIndex = currentClass.directMethods.indexOf(methodName);
  if (methodIndex >= 0) {
    return currentClass.directMethods[methodIndex];
  } else {
    findDirectMethod(currentClass.parent, methodName)
  }
}

function updateVirtualMethods(className) {
  var int i;
  for (i = 0; i < className.virtualMethods.length; i++) {    
	className.virtualMethod[i] = findDirectMethod(className);
  }
}


// var makeClass = function(typeName, parentName, access) {
  // return {
    // name: typeName,
    // parent: parentName,
    // accessFlags: access,

    // interfaces: [],

    // staticFields: [],
    // instanceFields: [],

    // directMethods: [],
    // virtualMethods: [],


    // sanityCheck: function() {
      // assert(this.name !== "", "Class name check")
    // }
  // }
// }


