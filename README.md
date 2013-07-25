project status
===

This was a course project. The implementation of the VM translates from DEX into an internal format, which is then executed. All opcodes are supported, but library / native call support is very limited. There is currently no development on this project.


dalvik-js
=========

Project for CS 691ST - Dalvik VM implementation in Javascript

[Assignment](http://plasma.cs.umass.edu/emery/grad-systems-project-1)

Setup environment for git access
Download project from here: https://github.com/jjfiv/dalvik-js.git

Live page hosted at: http://guptha-.github.com
Dex files can be loaded from the local machine.

Recommended supported browsers Firefox (15 and higher) and Chrome (22 and higher)
Open file in browser
example: ``install_path/dalvik-js/vmtest/index.html``

The above url will run builtin in test suite which exercises the opcodes supported by the VM

Known issues will be displayed in the Test failed area

Inorder to run a Dalvik formatted dex file
Open file in browser to
example: ``install_path/dalvik-js/src/index.html``

1. Within the html page a file upload dialog will be displayed click load button 
2. Runnable class files will be present
3. Select file and click run class button
4. Output produced by executed instructions will be displayed at bottom of page

Useful Links
------------
- [Bytecode Reference](http://source.android.com/tech/dalvik/dalvik-bytecode.html) Describes all 16-bit opcodes
- [Instruction Format](http://source.android.com/tech/dalvik/instruction-formats.html) Describes descriptions of opcodes
- [DEX Format](http://source.android.com/tech/dalvik/dex-format.html) Describes the multi-class container format we're probably parsing


