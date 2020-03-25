# intlang
An interpreted programming language, similar in design to an esoteric programming language.

##### Functions
I'm probably going to add many more functions to intlang as I don't have too much to do during this time.
As of 26/3/20 it has these functions:
```
00EE - clear
00EP - end print (newline (\n))
00PR <string> [optional: $VAR_<varindex> ]- Print <string>
00NC <var> - Increment <var> by 1
00DC <var> - Decrement <var> by 1
00SNC <var> <int> - Set <var> to <int>
00INITNC <var> - Initialise <var> to 0 for 00NC or 00DC - DEPRECATED: use 00SNC <var> 0
00EXA - Exit application gracefully
00SLP <milliseconds> - Sleep for <milliseconds>
00GT <line> - Go to <line>
00EQT $VAR_<var1> $VAR_<var2> <line> - If <var1> is equal to <var2> go to <line> (works for both strings and integers)
00BGT $VAR_<var1> $VAR_<var2> <line> - If <var1> is bigger than <var2> go to <line> (integer only)
00LST $VAR_<var1> $VAR_<var2> <line> - If <var1> is less than <var2> go to <line> (integer only)
00PRVAR <var> - Print <var> as string.
00DM <var> - Print <var> as integer.
00VSTR <var> <str> - Set <var> to <str>
00ADDV $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Add $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>
00SUBV $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Subtract $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>
00MULV $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Multiply $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>
00DIVR $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Divide $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>
```

##### Example Application
To somewhat demonstrate how to write an application in intlang, I wrote an application that prints "Hello, world!" 5 times, prints the output of the variable 4 which is variable 3 and variable 2 added, then prints "Done." and exits.
```
00SNC 3 5
00SNC 2 0
00EE
00PR Hello, world! $VAR_3
00EP
00NC 2
00DC 3
00SLP 500
00EQT $VAR_2 5 11
00GT 4
00ADDV $VAR_3 $VAR_2 4
00PR $VAR_4
00EP
00PR Done.
00EXA
```
Refer to the function list to understand what to do.

##### How to run an intlang program.
To execute an intlang program, currently you'll need node.js, but I'm probably going to work on a script that converts intlang programs to C to be compiled using GCC.

`node interpreter.js <script name>` is the currently preferred method to run an application in intlang.

intlang requires no external npm libraries, only built-in node.js libraries (fs, readline).

intlang was written by i386sh in March of 2020. Purely a hobby project.
