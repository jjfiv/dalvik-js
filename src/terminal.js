'use strict';

/*
 * This file contains all functions related to I/O
 * This should be the only place that knows how to
 * communicate with the HTML page, for our own sanity.
 *
 * Eventually, the terminal could be a lot more complicated,
 * but for now it should just offer simple printing.
 *
 */
 
var DEBUG = true;

var HTMLTerminal = function() {
  this._output = document.getElementById('output');
};

HTMLTerminal.prototype.print = function(str) {
  this._output.appendChild(document.createTextNode(str));
};

HTMLTerminal.prototype.println = function(str) {
  this.print(str + '\n');
};

HTMLTerminal.prototype.appendDebug = function(data, docObj){
    docObj.innerText+=data;
};

//--- global
var terminal = new HTMLTerminal();

