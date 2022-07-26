const arg = require('arg')

const parseArgsIntoOpt =  (arguments) => {
    const args = arg({
        "--skipPrompts": Boolean,
        "--filePath": String,
        "--source": String,
        "-p": "--skipPrompts",
        "-f": "--filePath",
        "-s": "--source"
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
        source: args["--source"]
    }
}

module.exports = parseArgsIntoOpt;