// Esoteric interpreted language.
// intlang written by i386sh, 2019.
// project started March 25th 2020 (AU)

/*
FUNCTIONS:

00EE - clear
00EP - end print (newline (\n))
00PR <string> - Print <string>
00NC <var> - Increment <var> by 1
00DC <var> - Decrement <var> by 1
00SNC <var> <int> - Set <var> to <int>
00INITNC <var> - Initialise <var> to 0 for 00NC or 00DC
00EXA - Exit application gracefully
00SLP <milliseconds> - Sleep for <milliseconds>
00GT <line> - Go to <line>
00EQT <var1> <var2> <line> - If <var1> is equal to <var2> go to <line> (works for both strings and integers)
00BGT <var1> <var2> <line> - If <var1> is bigger than <var2> go to <line> (integer only)
00LST <var1> <var2> <line> - If <var1> is less than <var2> go to <line> (integer only)
00PRVAR <var> - Print <var> as string.
00DM <var> - Print <var> as integer.
00VSTR <var> <str> - Set <var> to <str>
*/
const fs = require("fs")

argv = process.argv.splice(2);
if (!argv[0]) throw new Error("No program to run. Specify a code file (eg. ping.itlg)")
if (!fs.existsSync(argv[0])) {
    throw new Error(argv[0] + " is not a valid code file.")
}
var memory = [];

function hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = '';
    for (var i = 0;
        (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

var lineReader = require('readline').createInterface({
    input: fs.createReadStream(argv[0])
});

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
} // Sleep function

let goto = false; // Are we going to another line? (probably useless but cba to remove)
var code = []; // All the code separated line by line.
var readIndex = 1; // Line we're currently on

function gtx() { // So I don't have to type if(goto == false) etc a million times.
    if (goto == false) {
        readIndex += 1;
    }
}

lineReader.on('line', function(line) {
    code.push(line);
});

let program_running = true;

lineReader.on('close', async () => {
    while (program_running) {
        let line = code[readIndex - 1];
        const args = line.trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if(command == "") gtx();
        if (command == "00ee") {
            process.stdout.write("\u001b[2J\u001b[0;0H");
            gtx();
        } else if (command == "00pr") {
            goto = false;
            if (!args[0]) throw new Error("no text to print")
            process.stdout.write(args.join(" "))
            gtx();
        } else if (command == "00initnc") {
            if (!args[0]) throw new Error("no memory address to initialise")
            memory[args[0]] = 0;
            gtx()
        } else if (command == "00nc") {
            if (!args[0]) throw new Error("no memory address to increment")
            memory[args[0]] += 1;
            gtx();
        } else if (command == "00dc") {
            if (!args[0]) throw new Error("no memory address to decrement")
            memory[args[0]] -= 1;
            gtx();
        } else if (command == "00dm") {
            goto = false;
            if (!args[0]) throw new Error("no memory address to print")
            process.stdout.write("" + memory[args[0]]);
            gtx();
        } else if (command == "00ep") {
            goto = false;
            process.stdout.write("\n");
            gtx();
        } else if (command == "00vstr") {
            goto = false;
            if (!args[0]) throw new Error("no memory address to store variable in")
            if (!args[1]) throw new Error("no variable content")
            memory[args[0]] = args.slice(1).join(' ');
            gtx();
        } else if(command == "00prvar") {
          if(!args[0]) throw new Error("no memory address to print")
          process.stdout.write(memory[args[0]]);
        } else if (command == "00gt") {
            if (!args[0]) throw new Error("no line to go back to")
            readIndex = parseInt(args[0]);
            goto = true;
        } else if (command == "00slp") {
            if (!args[0]) throw new Error("no time set to sleep for")
            await sleep(parseInt(args[0])).then(() => {
                gtx();
            })
        } else if (command == "00bgt") {
            if (!args[0]) throw new Error("no first memory value specified")
            if (!args[1]) throw new Error("no second memory value specified")
            if (!args[2]) throw new Error("no line to goto specified")
            fv = memory[args[0]];
            sv = memory[args[1]];
            if (fv > sv) {
                readIndex = parseInt(args[2]);
                goto = true;
            } else {
                gtx();
            }
        } else if (command == "00lst") {
            if (!args[0]) throw new Error("no first memory value specified")
            if (!args[1]) throw new Error("no second memory value specified")
            if (!args[2]) throw new Error("no line to goto specified")
            fv = memory[args[0]];
            sv = memory[args[1]];
            if (fv < sv) {
                readIndex = parseInt(args[2]);
                goto = true;
            } else {
                gtx();
            }
        } else if (command == "00eqt") {
            if (!args[0]) throw new Error("no first memory value specified")
            if (!args[1]) throw new Error("no second memory value specified")
            if (!args[2]) throw new Error("no line to goto specified")
            fv = memory[args[0]];
            sv = memory[args[1]];
            if (fv == sv) {
                readIndex = parseInt(args[2]);
                goto = true;
            } else {
                gtx();
            }
        } else if (command == "00snc") {
            if (!args[0]) throw new Error("no memory value specified")
            if (!args[1]) throw new Error("no value specified")
            memory[args[0]] = parseInt(args[1]);
            gtx();
        } else if (command == "00exa") {
            program_running == false;
            process.stdout.write("\n")
            process.exit(0);
        }
    }
})
