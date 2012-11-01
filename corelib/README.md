Generating an Android core.dex
===============================

1. Go to [Initializing a Build Environment | Android](http://source.android.com/source/initializing.html)
   - You can skip anything having to do with ccache and USB support; we won't be building multiple times or for an actual Android deviceA
   - This page is mostly for acquiring the right packages.
   - I had to also set ``ANDROID_JAVA_HOME`` to where I installed the sun jdk; you can no longer get it from the ubuntu repos, and all the alternate ppa sources google turns up no longer seem to work

2. Get the Android source [Downloading the Source | Android](http://source.android.com/source/downloading.html)

3. run ``make core`` in your new source

4. Grab output file ``mv out/target/common/obj/JAVA_LIBRARIES/core_intermediates/noproguard.classes.dex core.dex``

5. Grab noproguard.classes.jar, extract, and reform using selections from java.lang and java.io (If you don't feel like trimming it down, just grab all of them.) I deleted at least java.lang.annotations and java.lang.ref...

6. Re-jar, Re-dex, and Dump to text for sanity.


Notes
=====

* odex files are "Optimized Dex Files" and they have a slightly different format, or at least a different magic number. Since they do not seem to be described in a document, we will not handle them in the scope of this project
* I originally found an odex file and pushed that to the repo, but the parser rejects it, and it might have unsupported opcodes inside

