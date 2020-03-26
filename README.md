# intlang
An interpreted programming language, that is simple and easy to read.

##### Functions
I'm probably going to add many more functions to intlang as I don't have too much to do during this time.

26/3/20: I updated how functions are read so it should be more simple for a human to understand.  
As of 26/3/20 it has these functions:
```
Variable:
$VAR_<var> <int/float/string> - Saves <int/float/string> to <var>
$VAR_<var> $RND_<min>_<max> - Generates a random number between <min> and <max> and saves it to <var>

Main Functions:
CLEAR - clear screen.
PRT <string> [optional: $VAR_<varindex> ] - Print <string>.
GET_INPUT <var> - Gets input from user then saves it to <var>
VNC <var> - Increment <var> by 1.
VDC <var> - Decrement <var> by 1.
EXIT - Exit application gracefully.
NEWLINE - Prints a new line.
SLP <milliseconds/$VAR_<var>> - Sleep for <milliseconds/$VAR_<var>>.
GT <line> - Go to <line>.
= $VAR_<var1> $VAR_<var2> <line> - If <var1> is equal to <var2> go to <line> (works for both strings and integers).
> $VAR_<var1> $VAR_<var2> <line> - If <var1> is bigger than <var2> go to <line> (integer only)
< $VAR_<var1> $VAR_<var2> <line> - If <var1> is less than <var2> go to <line> (integer only)
ADD $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Add $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>.
SUB $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Subtract $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>.
MULT $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Multiply $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>.
DIV $VAR_<var1>/<int> $VAR_<var2>/<int> <output_var> - Divide $VAR_<var1>/<int> and $VAR_<var2>/<int> then write to <output_var>.

Deprecated functions:
00PRVAR <var> - Print <var> as string. - DEPRECATED: use 00PR $VAR_<var
00DM <var> - Print <var> as integer. - DEPRECATED: use 00PR $VAR_<var>
00VSTR <var> <str> - Set <var> to <str>. - DEPRECATED: use $VAR_<var> <str>
00SNC <var> <int> - Set <var> to <int>. - DEPRECATED: use $VAR_<var> 0
00INITNC <var> - Initialise <var> to 0 for 00NC or 00DC. - DEPRECATED: use $VAR_<var> 0
```

##### Example Application
To somewhat demonstrate how to write an application in intlang, I wrote an application that prints "Hello, world!" 5 times, prints the output of the variable 4 which is variable 3 and variable 2 added, then prints "Done." and exits.
```
$VAR_2 0
$VAR_3 5
clear
prt Hello, world! $VAR_3
vnc 2
vdc 3
slp 500
= $VAR_2 5 10
gt 4
add $VAR_3 $VAR_2 4
prt $VAR_4
prt Done.
exit
```
Refer to the function list to understand what to do.

##### How to run an intlang program.
To execute an intlang program, currently you'll need node.js, but I'm probably going to work on a script that converts intlang programs to another language that can be compiled to binary form. (Most likely C#, as .NET core allows .NET apps to be somewhat portable now.)

`node interpreter.js <script name>` is the currently preferred method to run an application in intlang.

intlang requires no external npm libraries, only built-in node.js libraries (fs, readline).


intlang was written by i386sh in March of 2020. Purely a hobby project.
