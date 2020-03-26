// Esoteric interpreted language.
// intlang written by i386sh, 2019.
// project started March 25th 2020 (AU)
// last updated March 26th 2020 (AU)
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

function gtx() {
    readIndex += 1;
}

lineReader.on('line', function(line) {
    code.push(line);
});

let program_running = true;
lineReader.on('close', async () => {
    while (program_running) {
        const line = code[readIndex - 1];
        const args = line.trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        // debug:
        // console.log(`command: ${command},\nargs:${args},\nreadIndex:${readIndex}`)
        if(command.startsWith("$var_")) {
          var_ind = command.split("$var_");
          if(var_ind[1]) {
            if(args[0]) {
              x = parseFloat(args[0]);
              if(isNaN(x)){
                memory[var_ind[1]] = args.join(" ");
              } else {
                memory[var_ind[1]] = x;
              }
            }
          }
          gtx();
        } else if (command == "") {
          gtx();
        } else if (command == "clear") {
            process.stdout.write("\u001b[2J\u001b[0;0H");
            gtx();
        } else if (command == "prt") {
            goto = false;
            if (!args[0]) throw new Error("no text to print")
            pr_output = args.join(" ");
            howmanyvars = pr_output.match(/\$VAR_/g) || ""
            if (howmanyvars !== "") howmanyvars = howmanyvars.length;
            varsprocessed = 0;
            args.forEach((output) => {
                if (output.startsWith("$VAR_")) {
                    rpt = output.split("$VAR_");
                    pr_output = pr_output.replace(output, memory[rpt[1]]);
                    varsprocessed += 1
                }
                if (varsprocessed == howmanyvars) {
                    process.stdout.write(pr_output+"\n");
                }
            })
            gtx();
        } else if (command == "vnc") {
            if (!args[0]) throw new Error("no memory address to increment")
            memory[args[0]] += 1;
            gtx();
        } else if (command == "vdc") {
            if (!args[0]) throw new Error("no memory address to decrement")
            memory[args[0]] -= 1;
            gtx();
        } else if (command == "gt") {
            if (!args[0]) throw new Error("no line to go back to")
            readIndex = parseInt(args[0]);
        } else if (command == "slp") {
            if (!args[0]) throw new Error("no time set to sleep for")
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            await sleep(fv).then(() => {
                gtx();
            })
        } else if (command == ">") {
            if (!args[0]) throw new Error("no first number/variable specified")
            if (!args[1]) throw new Error("no second number/variable specified")
            if (!args[2]) throw new Error("no line to goto specified")
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            sv = args[1];
            if (sv.startsWith("$VAR_")) {
                sv = parseInt(memory[args[1].split("$VAR_")[1]]);
            } else {
                sv = parseInt(args[1]);
            }
            if (fv > sv) {
                readIndex = parseInt(args[2]);
            } else {
                gtx();
            }
        } else if (command == "<") {
            if (!args[0]) throw new Error("no first number/variable specified")
            if (!args[1]) throw new Error("no second number/variable specified")
            if (!args[2]) throw new Error("no line to goto specified")
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            sv = args[1];
            if (sv.startsWith("$VAR_")) {
                sv = parseInt(memory[args[1].split("$VAR_")[1]]);
            } else {
                sv = parseInt(args[1]);
            }
            if (fv < sv) {
                readIndex = parseInt(args[2]);
            } else {
                gtx();
            }
        } else if (command == "=") {
            if (!args[0]) throw new Error("no first variable/number specified")
            if (!args[1]) throw new Error("no second variable/number specified")
            if (!args[2]) throw new Error("no line to goto specified")
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            sv = args[1];
            if (sv.startsWith("$VAR_")) {
                sv = parseInt(memory[args[1].split("$VAR_")[1]]);
            } else {
                sv = parseInt(args[1]);
            }
            if (fv == sv) {
                readIndex = parseInt(args[2]);
            } else {
                gtx();
            }
        } else if (command == "exit") {
            program_running == false;
            process.exit(0);
        } else if (command == "add") {
            if (!args[0]) throw new Error("no first number/variable specified");
            if (!args[1]) throw new Error("no second number/variable specified");
            if (!args[2]) throw new Error("no output variable specified");
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            sv = args[1];
            if (sv.startsWith("$VAR_")) {
                sv = parseInt(memory[args[1].split("$VAR_")[1]]);
            } else {
                sv = parseInt(args[1]);
            }
            memory[args[2]] = fv + sv;
            gtx();
        } else if (command == "subt") {
            if (!args[0]) throw new Error("no first number/variable specified");
            if (!args[1]) throw new Error("no second number/variable specified");
            if (!args[2]) throw new Error("no output variable specified");
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            sv = args[1];
            if (sv.startsWith("$VAR_")) {
                sv = parseInt(memory[args[1].split("$VAR_")[1]]);

            } else {
                sv = parseInt(args[1]);
            }
            memory[args[2]] = fv - sv;
            gtx();
        } else if (command == "mult") {
            if (!args[0]) throw new Error("no first number/variable specified");
            if (!args[1]) throw new Error("no second number/variable specified");
            if (!args[2]) throw new Error("no output variable specified");
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            sv = args[1];
            if (sv.startsWith("$VAR_")) {
                sv = parseInt(memory[args[1].split("$VAR_")[1]]);
            } else {
                sv = parseInt(args[1]);
            }
            memory[args[2]] = fv * sv;
            gtx();
        } else if (command == "div") {
            if (!args[0]) throw new Error("no first number/variable specified");
            if (!args[1]) throw new Error("no second number/variable specified");
            if (!args[2]) throw new Error("no output variable specified");
            fv = args[0];
            if (fv.startsWith("$VAR_")) {
                fv = parseInt(memory[args[0].split("$VAR_")[1]]);
            } else {
                fv = parseInt(args[0]);
            }
            sv = args[1];
            if (sv.startsWith("$VAR_")) {
                sv = parseInt(memory[args[1].split("$VAR_")[1]]);
            } else {
                sv = parseInt(args[1]);
            }
            memory[args[2]] = fv / sv;
            gtx();
        } else {
          throw new Error(`Unknown code (${line}) on line ${readIndex}`)
        }
    }
})
