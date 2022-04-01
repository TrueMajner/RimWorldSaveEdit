const fs = require('fs');
const readline = require('readline-sync');

let firstLine = [];
let secondLine = [];

(() => {
    console.log("Welcome to RimWorld Save Edit (https://github.com/TrueMajner/RimWorldSaveEdit/)\n\n!!!DONT USE SPACES!!!\n\n");
    let filename = readline.question("Write the name of the save file (the file must be in "+ process.cwd() + ")\n");
    filename = filename.includes(".rws") ? filename : ((filename[filename.length-1] === ".") ? filename + ".rws" : filename + ".rws");

    const pawnType = readline.question("What type of pawns do you want to destroy?\n");
    const factionID = readline.question("Faction (ID) to remove pawns.\nExample : Faction_21\n");

    fs.readFile(filename, "utf8",
        function(error,data) {
            let foundOne = false;
            let foundTwo = false;
            let counter = 0;
            let foundCount = 0;
            let searchingEnd = false;
            let reset = 0;

            data.split(/\r?\n/).forEach(line => {
                if(searchingEnd) {
                    if(line.includes("</thing>")) {
                        reset = 0;
                        searchingEnd = false;
                        foundOne = false;
                        foundTwo = false;
                        secondLine[foundCount] = counter;
                    }
                }

                if(line.includes("<thing Class=\"Pawn\">")) {
                    foundCount ++;
                    firstLine[foundCount] = counter;
                    foundOne = true;
                }
                if(line.includes("<def>" + pawnType +"</def>") && foundOne) {
                    foundTwo = true;
                }

                if(foundOne && !searchingEnd) {
                    reset++;
                }

                if(foundOne && foundTwo && line.includes("<faction>" + factionID + "</faction>")) {
                    searchingEnd = true;
                }

                if(reset === 15) {
                    reset = 0;
                    searchingEnd = false;
                    foundTwo = false;
                    foundOne = false;
                    foundCount --;
                }
                counter++;
            });

            let newfile = "";
            let strnum = 0;
            let deleting = false;

            data.split(/\r?\n/).forEach(line => {
                if(firstLine.includes(strnum)) {
                    deleting = true;
                }
                else if(secondLine.includes(strnum-1)) {
                    deleting = false;
                }

                if(!deleting) {
                    newfile += "\n" + line;
                }
                strnum++;
            })

            fs.writeFileSync("./res.rws", newfile);
            console.log("New file : res.rws");
        });
})();