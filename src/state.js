'use strict'

/*
 * This file should contain all the global state related to the VM
 *
 * Keeping it in one object lets us better inspect it all at once
 * in the debugger, and might even let us "save/load" it to browser storage.
 *
 */

var state = (function() {

  return {
    running: false,

    // For a while, this array will be important
    // We will fill it with methods and fields that aren't found
    undefined_references: [],

    print: function(str) {
      output.appendChild(document.createTextNode(str))
    },
    println: function(str) {
      this.print(str + '\n')
    }
  }

})()

