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


doTest("string.dex", "Lstring;", "23Hi12Bye\n");

doTest("Bird.dex", "LBird;", "Rexy\ntrue\nfalse\nBlack\ntrue\ntrue\nHumpty\nfalse\nfalse\n");

doTest("ArrayTest.dex", "LArrayTest;", "3,4,5,6\n");

doTest("Monitors.dex", "LMonitors;", "a1\na2\nb1\nb2\n");

doTest("InterfaceTest.dex", "LInterfaceTest;", "Class A implements user-defined InterfaceA.\n" );


// note - may depend on scheduling algorithm
doTest("ThreadInstanceTest.dex", "LThreadInstanceTest;", "moo!\nmeow!\n");
doTest("tryCatch.dex", "LtryCatch;", "No way!\n\n");

doTest("Add_double.dex", "LAdd_double;", "5.84\n");
doTest("Add_double_2addr.dex", "LAdd_double_2addr;", "6.84\n");
doTest("Add_float_2addr.dex", "LAdd_float_2addr;", "6.840000152587891\n");
doTest("Add_float.dex", "LAdd_float;", "5.840000152587891\n");
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
doTest("Check_cast.dex", "LCheck_cast;", "\n");
doTest("Cmp_long.dex", "LCmp_long;", "true\n");
doTest("Cmpg_double.dex", "LCmpg_double;", "true\n");
doTest("Cmpl_double.dex", "LCmpl_double;", "true\n");
doTest("Cmpl_float.dex", "LCmpl_float;", "true\n");
doTest("Cmpg_float.dex", "LCmpg_float;", "true\n");
doTest("Const_16.dex", "LConst_16;", "-20000\n");
doTest("Const_4.dex", "LConst_4;", "-4\n");
doTest("Const_class.dex", "LConst_class;", "java.util.Date\n");
doTest("Const_high16.dex", "LConst_high16;", "0x12340000\n");
doTest("Const_string.dex", "LConst_string;", "android\n");
doTest("Const_string_jumbo.dex", "LConst_string_jumbo;", "android jumbo\n");
doTest("Const_wide_16.dex", "LConst_wide_16;", "20000\n");
doTest("Const_wide_32.dex", "LConst_wide_32;", "20000000\n");
doTest("Const_wide_high16.dex", "LConst_wide_high16;", "1311673391471656960\n");
doTest("Const_wide.dex", "LConst_wide;", "1.2345678901232324e+51\n");
doTest("Div_double_2addr.dex", "LDiv_double_2addr;", "1.8598726114649682\n");
doTest("Div_double.dex", "LDiv_double;", "0.8598726114649682\n");
doTest("Div_float_2addr.dex", "LDiv_float_2addr;", "1.859872579574585\n");
doTest("Div_float.dex", "LDiv_float;", "0.859872579574585\n");
doTest("Div_int_2addr.dex", "LDiv_int_2addr;", "3\n");
doTest("Div_int.dex", "LDiv_int;", "2\n");
doTest("Div_int_lit16.dex", "LDiv_int_lit16;", "2\n");
doTest("Div_int_lit8.dex", "LDiv_int_lit8;", "2\n");
doTest("Div_long_2addr.dex", "LDiv_long_2addr;", "3\n");
doTest("Div_long.dex", "LDiv_long;", "2\n");
doTest("Double_to_float.dex", "LDouble_to_float;", "2.6999998092651367\n");
doTest("Double_to_int.dex", "LDouble_to_int;", "2\n");
doTest("Double_to_long.dex", "LDouble_to_long;", "2\n");
doTest("Fill_array_range.dex", "LFill_array_range;", "true\n");
doTest("Fill_array.dex", "LFill_array;", "4\n");
doTest("Float_to_double.dex", "LFloat_to_double;", "0.5\n");
doTest("Float_to_int.dex", "LFloat_to_int;", "2\n");
doTest("Float_to_long.dex", "LFloat_to_long;", "2\n");
doTest("Goto_16.dex", "LGoto_16;", "0\n");
doTest("Goto_32.dex", "LGoto_32;", "0\n");
doTest("If_eq.dex", "LIf_eq;", "true\n");
doTest("If_ge.dex", "Lif_ge;", "true\n");
doTest("If_gt.dex", "Lif_gt;", "true\n");
doTest("If_le.dex", "Lif_le;", "true\n");
doTest("If_lt.dex", "Lif_lt;", "true\n");
doTest("If_ne.dex", "Lif_ne;", "true\n");
doTest("Iget_boolean.dex", "Liget_boolean;", "true\n");
doTest("Iget_byte.dex", "Liget_byte;", "77\n");
doTest("Iget_char.dex", "Liget_char;", "A\n");
doTest("Iget_long.dex", "Liget_long;", "1234567890\n");
doTest("Iget_object.dex", "Liget_object;", "null\n");
doTest("Iget_short.dex", "Liget_short;", "3200\n");
doTest("Iget_wide.dex", "Liget_wide;", "12345679890123\n");
doTest("Iget.dex", "Liget;", "5\n");
doTest("Instance_of.dex", "Linstance_of;", "true\n");
doTest("Int_to_byte.dex", "Lint_to_byte;", "1\n");
doTest("Int_to_char.dex", "Lint_to_char;", "A\n");
doTest("Int_to_double.dex", "Lint_to_double;", "1\n");
doTest("Int_to_long.dex", "Lint_to_long;", "123456\n");
doTest("Int_to_short.dex", "Lint_to_short;", "1\n");
doTest("Iput_boolean.dex", "Liput_boolean;", "true\n");
doTest("Iput_byte.dex", "Liput_byte;", "77\n");
doTest("Iput_char.dex", "Liput_char;", "A\n");
doTest("Iput_object.dex", "Liput_object;", "null\n");
doTest("Iput_short.dex", "Liput_short;", "77\n");
doTest("Iput_wide.dex", "Liput_wide;", "778899112233\n");
doTest("Iput.dex", "Liput;", "2\n");
doTest("Long_to_double.dex", "LLong_to_double;", "50000000000\n");
doTest("Long_to_float.dex", "LLong_to_float;", "123456788103168\n");
doTest("Long_to_int.dex", "LLong_to_int;", "-123456789\n");
doTest("Monitor_enter.dex", "LMonitor_enter;", "2\n");
doTest("Monitor_exit.dex", "LMonitor_exit;", "\n");
doTest("Mul_double_2addr.dex", "LMul_double_2addr;", "9.478000000000002\n");
doTest("Mul_double.dex", "LMul_double;", "8.478000000000002\n");
doTest("Mul_float_2addr.dex", "LMul_float_2addr;", "9.477999687194824\n");
doTest("Mul_float.dex", "LMul_float;", "8.477999687194824\n");
doTest("Mul_int_2addr.dex", "LMul_int_2addr;", "33\n");
doTest("Mul_int_lit16.dex", "LMul_int_lit16;", "32\n");
doTest("Mul_int_lit8.dex", "LMul_int_lit8;", "32\n");
doTest("Mul_int.dex", "LMul_int;", "32\n");
doTest("Mul_long_2addr.dex", "LMul_long_2addr;", "1082152022374639\n");
doTest("Mul_long.dex", "LMul_long;", "1082152022374638\n");
doTest("Neg_to_double.dex", "Lneg_to_double;", "-1\n");
doTest("Neg_to_float.dex", "Lneg_to_float;", "-1\n");
doTest("Neg_to_int.dex", "Lneg_to_int;", "-1\n");
doTest("Neg_to_long.dex", "Lneg_to_long;", "-123123123272432432\n");
doTest("New_array.dex", "LNew_array;", "10\n");
doTest("New_instance.dex", "LNew_instance;", "0\n");
doTest("Nop.dex", "LNop;", "true\n");
doTest("Not_int.dex", "LNot_int;", "-5\n");
doTest("Not_long.dex", "LNot_long;", "-500000\n");
doTest("Or_int_2addr.dex", "LOr_int_2addr;", "16\n");
doTest("Or_int_lit16.dex", "LOr_int_lit16;", "15\n");
doTest("Or_int_lit8.dex", "LOr_int_lit8;", "15\n");
doTest("Or_int.dex", "LOr_int;", "15\n");
doTest("Or_long_2addr.dex", "LOr_long_2addr;", "123456789124\n");
doTest("Or_long.dex", "LOr_long;", "123456789123\n");
doTest("Packed_switch.dex", "LPacked_switch;", "Green\n");
doTest("Rem_double_2addr.dex", "LRem_double_2addr;", "3.7\n");
doTest("Rem_double.dex", "LRem_double;", "2.7\n");
doTest("Rem_float_2addr.dex", "LRem_float_2addr;", "3.700000047683716\n");
doTest("Rem_float.dex", "LRem_float;", "2.700000047683716\n");
doTest("Rem_int_2addr.dex", "LRem_int_2addr;", "1\n");
doTest("Rem_int_lit16.dex", "LRem_int_lit16;", "0\n");
doTest("Rem_int_lit8.dex", "LRem_int_lit8;", "0\n");
doTest("Rem_int.dex", "LRem_int;", "0\n");
doTest("Rem_long_2addr.dex", "LRem_long_2addr;", "2000000001\n");
doTest("Rem_long.dex", "LRem_long;", "2000000000\n");
doTest("Return_object.dex", "LReturn_object;", "Hello\n");
doTest("Return_void.dex", "LReturn_void;", "23456\n");
doTest("Return_wide.dex", "LReturn_wide;", "23456\n");
doTest("Rsub_int_lit8.dex", "LRsub_int_lit8;", "-4\n");
doTest("Rsub_int.dex", "LRsub_int;", "-4\n");
doTest("Sget_boolean.dex", "Lsget_boolean;", "true\n");
doTest("Sget_byte.dex", "Lsget_byte;", "77\n");
doTest("Sget_char.dex", "Lsget_char;", "A\n");
doTest("Sget_long.dex", "Lsget_long;", "1234567890\n");
doTest("Sget_object.dex", "Lsget_object;", "null\n");
doTest("Sget_short.dex", "Lsget_short;", "3200\n");
doTest("Sget_wide.dex", "Lsget_wide;", "12345679890123\n");
doTest("Sget.dex", "Lsget;", "5\n");
doTest("Shl_int_2addr.dex", "LShl_int_2addr;", "31\n");
doTest("Shl_int_lit8.dex", "LShl_int_lit8;", "30\n");
doTest("Shl_int.dex", "LShl_int;", "30\n");
doTest("Shl_long_2addr.dex", "LShl_long_2addr;", "40000000001\n");
doTest("Shl_long.dex", "LShl_long;", "40000000000\n");
doTest("Shr_int_2addr.dex", "LShr_int_2addr;", "8\n");
doTest("Shr_int_lit8.dex", "LShr_int_lit8;", "7\n");
doTest("Shr_int.dex", "LShr_int;", "7\n");
doTest("Shr_long_2addr.dex", "LShr_long_2addr;", "5000000001\n");
doTest("Shr_long.dex", "LShr_long;", "5000000000\n");
doTest("Sparse_switch.dex", "LSparse_switch;", "Green\n");
doTest("Sput_boolean.dex", "Lsput_boolean;", "true\n");
doTest("Sput_byte.dex", "Lsput_byte;", "77\n");
doTest("Sput_char.dex", "Lsput_char;", "A\n");
doTest("Sput_object.dex", "Lsput_object;", "null\n");
doTest("Sput_short.dex", "Lsput_short;", "77\n");
doTest("Sput_wide.dex", "Lsput_wide;", "778899112233\n");
doTest("Sput.dex", "Lsput;", "2\n");
doTest("Sub_double_2addr.dex", "LSub_double_2addr;", "0.56\n");
doTest("Sub_double.dex", "LSub_double;", "-0.43999999999999995\n");
doTest("Sub_float_2addr.dex", "LSub_float_2addr;", "0.559999942779541\n");
doTest("Sub_float.dex", "LSub_float;", "-0.440000057220459\n");
doTest("Sub_int_2addr.dex", "LSub_int_2addr;", "5\n");
doTest("Sub_int_lit16.dex", "LSub_int_lit16;", "4\n");
doTest("Sub_int_lit8.dex", "LSub_int_lit8;", "4\n");
doTest("Sub_int.dex", "LSub_int;", "4\n");
doTest("Sub_long_2addr.dex", "LSub_long_2addr;", "-75308642\n");
doTest("Sub_long.dex", "LSub_long;", "-75308643\n");
doTest("Ushr_int_2addr.dex", "LUshr_int_2addr;", "8\n");
doTest("Ushr_int_lit8.dex", "LUshr_int_lit8;", "7\n");
doTest("Ushr_int.dex", "LUshr_int;", "7\n");
doTest("Ushr_long_2addr.dex", "LUshr_long_2addr;", "5000000001\n");
doTest("Ushr_long.dex", "LUshr_long;", "5000000000\n");
doTest("Xor_int_2addr.dex", "LXor_int_2addr;", "8\n");
doTest("Xor_int_lit16.dex", "LXor_int_lit16;", "7\n");
doTest("Xor_int_lit8.dex", "LXor_int_lit8;", "7\n");
doTest("Xor_int.dex", "LXor_int;", "7\n");
doTest("Xor_long_2addr.dex", "LXor_long_2addr;", "4\n");
doTest("Xor_long.dex", "LXor_long;", "3\n");

