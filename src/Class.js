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

    directMethods: [], // directMethods are "static" or class methods
    virtualMethods: [], // virtualMethods are instance methods


    sanityCheck: function() {
      assert(this.name !== "", "Class name check")
    }
  }
}


