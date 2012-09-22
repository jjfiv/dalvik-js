#!/bin/sh

ANDROID_SDK=~/bin/android-sdk-linux
JAVAC=javac
DX=$ANDROID_SDK/platform-tools/dx
DEXDUMP=$ANDROID_SDK/platform-tools/dexdump

# make class file
$JAVAC factorial.java
# make dex file
$DX --dex --output factorial.dex factorial.class
# disassemble dex
$DEXDUMP -d factorial.dex > factorial.dasm


