//--- Append tests here
// so it turns out we need to HTML escape our expected output: &gt; &lt; &amp;

// doTest(fileName, mainClassName, expectedOutput
doTest("factorial.dex", "Lfactorial;", "24\n");
doTest("seqSwitch.dex", "LSeqSwitch;", "Orange\n");
// complicated output:
doTest("testSeveralMethods.dex", "LtestSeveralMethods;", "TODO\n");

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

