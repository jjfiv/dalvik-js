VMTest Scripting
================

Usage:

    python dex2js.py ../tests/factorial.dex

Creates a ``factorial.dex.js`` in the current working directory with contents:

    files["factorial.dex"] = [ binary data ];

We need to include this file in ``index.html``

   <!--
     INCLUDE NEW TEST CASES HERE:
   -->
   <script src="factorial.dex.js"></script>
   <script src="seqSwitch.dex.js"></script>
   <script src="testSeveralMethods.dex.js"></script>
   <script src="bitWise.dex.js"></script>


Then, we create a test by opening ``tests.js`` and creating an appropriate call to ``doTest``

    doTest("factorial.dex", "Lfactorial;", "24\n");

Creating output: If you have the .java file, you can create output in the following way, using out2.js.py

    java -cp ../tests factorial | python out2js.py

For me, this returns the appropriate string ("24\n"), which can then be copied into a ``doTest`` call.

Now reload the ``vmtest/index.html``

Fin.

