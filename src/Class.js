//
// This module defines our own internal representation of classes
//



var Class = function (_name, _accessFlags, _parent) {
	//Returns Class Name		
	this.name = _name;		
	this.getClassName = function() {	
		var _nameC = this.name ;
		var _className = classData._nameC;
	return _className;
	}

	//Returns accessFlag
	this.accessFlag = _accessFlags;
	this.getAccessFlag = function() {
		var _accessF = this.accessFlag;
		var _accessField = classData._accessF;			
	return _accessField;
	}

	//Returns accessFlag
	this.parent = _parent;		
	this.getParentClassName = function() {
		var _parentC = this.parent;
		var _classParent = classData._parentC;

	return _classParent;
	}
			
  this.interfaces = [];
  this.staticFields = [];
  this.instanceFields = [];
  this.directMethods = []; // directMethods are "static" or class methods
  this.virtualMethods = []; // virtualMethods are instance methods			

};

var classData = ["name":"LMathCalc;","accessFlags":"(PUBLIC)","parent":"Ljava/lang/Object;"];
var testClass = new Class[
  {
    name: "Ltest/HelloWorld;",
    parent: "Ljava/lang/Object;",
    accessFlags: 0,
    interfaces: [],
    staticFields: [],
    instanceFields: [],

    directMethods: [
      {
        name: "main",
        returnType: "V",
        params: ["[Ljava/lang/String;"],
        numRegisters: 2,
        icode: [
          {op: "static-get", dest: 0, field:"Ljava/lang/System;.out:Ljava/io/PrintStream;"},
          {op: "move-const", dest: 1, value: 45},
          {op: "invoke", kind: "virtual", argumentRegisters: [0, 1], method: "Ljava/io/Printstream;.println"},
          {op: "return"}
        ]
      },
      {
        name: "<init>",
        returnType: "V",
        params: [],
        numRegisters: 1,
        icode: [
          {op: "invoke", kind: "direct", argumentRegisters: [0], method: "Ljava/lang/Object;.<init>"},
          {op: "return"}
        ]
      }
    ]

  }
];






//Access Flag types
/*
ACC_PUBLIC 	0x1 	public: visible everywhere
ACC_PRIVATE 	0x2 	* private: only visible to defining class 
ACC_PROTECTED 	0x4 	* protected: visible to package and subclasses
ACC_STATIC 	0x8 	* static: is not constructed with an outer this reference 	static: global to defining class 	static: does not take a this argument
ACC_FINAL 	0x10 	final: not subclassable 	final: immutable after construction 	final: not overridable
ACC_SYNCHRONIZED 	0x20 	  	  	synchronized: associated lock automatically acquired around call to this method. Note: This is only valid to set when ACC_NATIVE is also set.
ACC_VOLATILE 	0x40 	  	volatile: special access rules to help with thread safety 	 
ACC_BRIDGE 	0x40 	  	  	bridge method, added automatically by compiler as a type-safe bridge
ACC_TRANSIENT 	0x80 	  	transient: not to be saved by default serialization 	 
ACC_VARARGS 	0x80 	  	  	last argument should be treated as a "rest" argument by compiler
ACC_NATIVE 	0x100 	  	  	native: implemented in native code
ACC_INTERFACE 	0x200 	interface: multiply-implementable abstract class 	  	 
ACC_ABSTRACT 	0x400 	abstract: not directly instantiable 	  	abstract: unimplemented by this class
ACC_STRICT 	0x800 	  	  	strictfp: strict rules for floating-point arithmetic
ACC_SYNTHETIC 	0x1000 	not directly defined in source code 	not directly defined in source code 	not directly defined in source code
ACC_ANNOTATION 	0x2000 	declared as an annotation class 	  	 
ACC_ENUM 	0x4000 	declared as an enumerated type 	declared as an enumerated value 	 
(unused) 	0x8000 	  	  	 
ACC_CONSTRUCTOR 	0x10000 	  	  	constructor method (class or instance initializer)
ACC_DECLARED_
SYNCHRONIZED 	0x20000 	  	  	declared synchronized. Note: This has no effect on execution (other than in reflection of this flag, per se).
*/

//Direction Methods types
/*
static, private, or constructor
*/

//Virtual Methods types
/*
static, private, or constructor
*/
Class.prototype.sanityCheck = function() {
  assert(this.name !== "", "Class name check");
  assert(this.name[0] === "L", "Class name check: L");
  assert(this.accessFlags !== "", "Access Flag name check");
  assert(this.parent !== "", "Class name check");
  assert(this.parent[0] === "L", "Class name check: L");  
  
};




