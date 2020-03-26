// intlang written by i386sh, 2019.
// project started March 25th 2020 (AU)
// last updated March 26th 2020 (AU)
const fs = require("fs")
const readline = require("readline");

argv = process.argv.splice(2);
if (!argv[0]) throw new Error("No program to run. Specify a code file (eg. ping.itlg)")
if (!fs.existsSync(argv[0])) {
    throw new Error(argv[0] + " is not a valid code file.")
}

var memory = [];

var lineReader = readline.createInterface({
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

function get_user_input() {
    // https://stackoverflow.com/a/49699005
    return new Promise((resolve, reject) => {
        process.stdin.resume();
        process.stdin.on('data', data => {
            resolve(data.toString().trim())
            // To prevent node from complaining that there's too many listeners. Oh yeah and to probably stop memory leaking too.
            process.stdin.removeAllListeners('data')
        });
    });
}

let program_running = true;

lineReader.on('close', async () => {
    while (program_running) {
        const line = code[readIndex - 1];
        const args = line.trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        // debug:
        // console.log(`command: ${command},\nargs:${args},\nreadIndex:${readIndex}`)
        if (command.startsWith("$var_")) {
            var_ind = command.split("$var_");
            if (var_ind[1]) {
                if (args[0]) {
                    x = parseFloat(args[0]);
                    if (isNaN(x)) {
                        m = args.join(" ");
                        if (m.startsWith("$RND_")) {
                            r = m.split('$RND_');
                            z = r[1].split('_');
                            memory[var_ind[1]] = Math.floor(Math.random() * (+z[1] - +z[0])) + +z[0];
                            // This also is pretty bad but it does do the trick.
                        } else {
                            memory[var_ind[1]] = args.join(" ");
                        }
                    } else {
                        memory[var_ind[1]] = x;
                    }
                }
            }
            gtx();
        } else if (command == "") {
            gtx();
        } else if (command == "get_input") {
            if (!args[0]) throw new Error("no variable to save to")
            memory[args[0]] = await get_user_input()
            gtx();
        } else if (command == "clear") {
            process.stdout.write("\u001b[2J\u001b[0;0H");
            gtx();
        } else if (command == "newline") {
            process.stdout.write("\n");
            gtx();
        } else if (command == "prt") {
            // This is probably the worst code I've written, but I'm not going to complain. It works.
            goto = false;
            if (!args[0]) throw new Error("no text to print")
            pr_output = args.join(" ");
            howmanyvars = pr_output.match(/\$VAR_/g) || 0;
            if (howmanyvars !== 0) howmanyvars = howmanyvars.length;
            varsprocessed = 0;
            if (howmanyvars == 0) {
                process.stdout.write(pr_output + "\n");
                gtx();
            } else {
                output_done = false;
                args.forEach((output) => {
                    if (output.startsWith("$VAR_")) {
                        rpt = output.split("$VAR_");
                        pr_output = pr_output.replace("$VAR_" + rpt[1].match(/\d+/g), memory[rpt[1].match(/\d+/g)]);
                        varsprocessed += 1
                    }
                    if (varsprocessed == howmanyvars) {
                        if (output_done == true) return;
                        output_done = true;
                        process.stdout.write(pr_output + "\n");
                    }
                })
                gtx()
            }
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
