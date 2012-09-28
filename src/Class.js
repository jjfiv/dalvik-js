'use strict'

//
// This module defines our own internal representation of classes
//

var makeClass = function(typeName, parentName, access) {
  return {
    name: typeName,
    parent: parentName,
    accessFlags: access,

    interfaces: [],

    staticFields: [],
    instanceFields: [],

    directMethods: [],
    virtualMethods: [],


    sanityCheck: function() {
      assert(this.name !== "", "Class name check")
    }
  }
}


