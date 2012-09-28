'use strict'

/*
 * This file contains all functions related to I/O
 * This should be the only place that knows how to
 * communicate with the HTML page, for our own sanity.
 *
 * Eventually, the terminal could be a lot more complicated,
 * but for now it should just offer simple printing.
 *
 */

var terminal = (function() {
  var output = document.getElementById('output')

  var module = {
    print: function(str) {
      output.appendChild(document.createTextNode(str))
    },
    println: function(str) {
      module.print(str + '\n')
    }
  }
  
  return module;
})()

