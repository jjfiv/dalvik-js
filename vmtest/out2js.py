#!/usr/bin/env python

import os,sys

# reads from standard input and converts to a javascript appropriate string
if __name__ == '__main__':
  if len(sys.argv) != 1:
    print("usage: java TestCase | out2js.py");

  def getc():
    return sys.stdin.read(1)
  def puts(s): 
    return sys.stdout.write(s)

  puts('"')

  # special conversions
  special =['\n', '&', '<', '>']
  replace =['\\n', '&amp;', '&lt;', '&gt;']

  while True:
    c = getc()
    if c == '':
      break;

    if c in special:
      puts(replace[special.index(c)])
      continue;

    puts(c)

  puts('"\n')

