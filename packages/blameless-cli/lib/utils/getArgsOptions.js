const arg = require('arg')

const parseArgsIntoOpt =  (arguments) => {
    const args = arg({
        "--skip": Boolean,
        "--filePath": String,
        "-s": "--skip",
        "-f": "--filePath"
    },
    {
        argv: arguments.slice(2),
    });

    const missingPathArgument = new Error('Missing required argument: -f')

    if (!args['--filePath'])  throw  missingPathArgument.message


    return {
        hidePrompts: args["--skip"] || false,
        filePath: args["--filePath"] 
    }
}

module.exports = parseArgsIntoOpt;