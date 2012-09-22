#!/usr/bin/env python

import os,sys

# reads a file as binary, and outputs the bytes as an array in the format [%d,%d...%d]
# not the most space efficient, but the easiest
if __name__ == '__main__':
  input_file = sys.argv[1]

  result = '[';
  i = 0

  with open(input_file, 'rb') as fp:
    while(1):
      byte = fp.read(1)
      if byte == '':
        break
      if i != 0:
        result += ','
      result += ("%d" % ord(byte))
      i += 1

  result += ']'

  print(result)


