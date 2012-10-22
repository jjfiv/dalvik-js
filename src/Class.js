//
// This module defines our own internal representation of classes
//



var Class = function (name, accessFlags, parent) {
		
	this.name = name;	
	this.accessFlag = accessFlags;
	this.parent = parent;		
	this.interfaces = [];
	this.staticFields = [];
	this.instanceFields = [];
  	this.directMethods = []; // directMethods are "static" or class methods
  	this.virtualMethods = []; // virtualMethods are instance methods			

};

	//Returns Class Name	
Class.prototype.getClassName = function() {	
	this.name = classData.name;
	return this.name;
};

	//Returns Class accessFlag
Class.prototype.getAccessFlag = function() {
	this.accessFlag = classData.accessFlag;			
	return this.accessFlag;
	}

	//Returns Class parent
Class.prototype.getParentClassName = function() {
	this.parent = classData.parent;
	return this.parent;
	}

var classData = {"name":"LMathCalc;","accessFlags":"(PUBLIC)","parent":"Ljava/lang/Object;"};




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




