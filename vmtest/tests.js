//--- Append tests here
// so it turns out we need to HTML escape our expected output: &gt; &lt; &amp;

// doTest(fileName, mainClassName, expectedOutput
doTest("factorial.dex", "Lfactorial;", "24\n");
doTest("recurse.dex", "Lrecurse;", "24\n");
doTest("seqSwitch.dex", "LSeqSwitch;", "Orange\n");
// complicated output:
doTest("testSeveralMethods.dex", "LtestSeveralMethods;",
"This is a static and fruitless method with no args.\n"+
"This is a fruitless instance method with no args.\n"+
"This is a fruitful static method with no args.\n"+
"This is a fruitful instance method with no args.\n"+
"This is an overloaded static fruitless method with one arg.\n"+
"This is an overloaded fruitless instance method with one arg.\n"+
"This is an overloaded fruitful static method with one arg.\n"+
"This is an overloaded fruitful instance method with one arg.\n"+
"true\n");

// so it turns out we need to HTML escape our expected output: &gt; &lt; &amp;
doTest("bitWise.dex", "LbitWiseTests;", 
       "a &amp; b = \n2\n" +
       "a | b = \n7\n" + 
       "a ^ b = \n5\n" + 
       "~a = \n-7\n" + 
       "24\n" +
       "24\n" + 
       "a &gt;&gt; 2  = \n" +
       "1\n" +
       "a &gt;&gt;&gt; 2 = \n" +
       "1\n"
      );

doTest("FillArrayRange.dex", "LFillArrayRange;", "true\n");
doTest("IntCast.dex", "LIntCast;", "J\n74\n-16657\n");
doTest("ArgumentDirection.dex", "LArgumentDirection;", "1\n2\n3\n");

doTest("PrimitiveCast.dex",
       "LPrimitiveCast;",
       "true\ntrue\ntrue\n"+
       "true\ntrue\ntrue\n"+
       "true\ntrue\ntrue\n"+
       "true\ntrue\ntrue\n"
      );

doTest("Bird.dex", "LBird;", "Rexy\ntrue\nfalse\nBlack\ntrue\ntrue\nHumpty\nfalse\nfalse\n");

doTest("ArrayTest.dex", "LArrayTest;", "3,4,5,6\n");

