#!/usr/bin/env python

import os,sys

# reads a file as binary, and outputs the bytes as an array in the format [%d,%d...%d]
# not the most space efficient, but the easiest
if __name__ == '__main__':
  if len(sys.argv) != 2:
    print("usage: dex2js.py dex_file_name");

  input_file = sys.argv[1]

  file_name = os.path.basename(input_file);

  result = 'files["%s"] = [' % file_name;
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

  result += '];\n'

  #output to a file
  with open(file_name+'.js', 'w') as fp:
   fp.write(result)


