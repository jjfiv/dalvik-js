'use strict';


var mock_hello_classes = [
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
          {op: "return"},
        ],
      },
      {
        name: "<init>",
        returnType: "V",
        params: [],
        numRegisters: 1,
        icode: [
          {op: "invoke", kind: "direct", argumentRegisters: [0], method: "Ljava/lang/Object;.<init>"},
          {op: "return"},
        ],
      }
    ]

  },
];


