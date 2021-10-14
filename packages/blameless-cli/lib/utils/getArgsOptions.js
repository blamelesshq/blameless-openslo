const arg = require('arg')

const parseArgsIntoOpt =  (arguments) => {
    const args = arg({
        "--skip": Boolean,
        "--filePath": String,
        "-s": "--skip",
        "-f": "--filePath",
    },
    {
        argv: arguments.slice(2),
    });


    if (!args['--filePath'] || !(arguments.slice(2).length > 1)) {
        console.log('Error: Missing required argument: -f <file_path>')
        return
    }  

    return {
        hidePrompts: args["--skip"] || false,
        filePath: args["--filePath"],
    }
}

module.exports = parseArgsIntoOpt;