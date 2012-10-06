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

var HTMLTerminal = function() {
  this._output = document.getElementById('output')
}

HTMLTerminal.prototype.print = function(str) {
  this.output.appendChild(document.createTextNode(str))
}

HTMLTerminal.prototype.println = function(str) {
  this.print(str + '\n');
}

//--- global
var terminal = new HTMLTerminal();

