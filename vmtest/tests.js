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

doTest("string.dex", "Lstring;", "23Hi12Bye\n");

doTest("Monitors.dex", "LMonitors;", "a1\na2\nb1\nb2\n");

doTest("InterfaceTest.dex", "LInterfaceTest;", "Class A implements user-defined InterfaceA.\n" );

// note - may depend on scheduling algorithm
doTest("ThreadInstanceTest.dex", "LThreadInstanceTest;", "moo!\nmeow!\n");

doTest("Add_double.dex", "LAdd_double;", "5.84\n");
doTest("Add_double_2addr.dex", "LAdd_double_2addr;", "6.84\n");
doTest("Add_float_2addr.dex", "LAdd_float_2addr;", "6.84\n");
doTest("Add_float.dex", "LAdd_float;", "5.84\n");
doTest("Add_int_2addr.dex", "LAdd_int_2addr;", "13\n");
doTest("Add_int_lit16.dex", "LAdd_int_lit16;", "12\n");
doTest("Add_int_lit8.dex", "LAdd_int_lit8;", "12\n");
doTest("Add_int.dex", "LAdd_int;", "12\n");
doTest("Add_long_2addr.dex", "LAdd_long_2addr;", "100000000\n");
doTest("Add_long.dex", "LAdd_long;", "99999999\n");
doTest("Aget_boolean.dex", "LAget_boolean;", "true\n");
doTest("Aget_byte.dex", "LAget_byte;", "100\n");
doTest("Aget_char.dex", "LAget_char;", "g\n");
doTest("Aget_object.dex", "LAget_object;", "a\n");
doTest("Aget_short.dex", "LAget_short;", "10000\n");
doTest("Aget_wide.dex", "LAget_wide;", "1000000000000000000\n");
doTest("Aget.dex", "LAget;", "100000000\n");
doTest("And_int_2addr.dex", "LAnd_int_2addr;", "9\n");
doTest("And_int_lit16.dex", "LAnd_int_lit16;", "8\n");
doTest("And_int_lit8.dex", "LAnd_int_lit8;", "8\n");
doTest("And_long_2addr.dex", "LAnd_long_2addr;", "39471122\n");
doTest("And_long.dex", "LAnd_long;", "39471121\n");
doTest("Aput_boolean.dex", "LAput_boolean;", "true\n");
doTest("Aput_byte.dex", "LAput_byte;", "100\n");
doTest("Aput_char.dex", "LAput_char;", "g\n");
doTest("Aput_object.dex", "LAput_object;", "hello\n");
doTest("Aput_short.dex", "LAput_short;", "10000\n");
doTest("Aput_wide.dex", "LAput_wide;", "100000000000\n");
doTest("Aput.dex", "LAput;", "100000000\n");
doTest("Array_length.dex", "LArray_length;", "5\n");
