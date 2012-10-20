#!/bin/sh

ANDROID_SDK=~/bin/android-sdk-linux
JAVAC=javac
DX=$ANDROID_SDK/platform-tools/dx
DEXDUMP=$ANDROID_SDK/platform-tools/dexdump

INPUT=Animal

# make class file
$JAVAC $INPUT.java
# make dex file
$DX --dex --output $INPUT.dex *.class
# disassemble dex
$DEXDUMP -d $INPUT.dex > $INPUT.text


