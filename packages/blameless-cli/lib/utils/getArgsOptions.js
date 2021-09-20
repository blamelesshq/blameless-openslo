const arg = require('arg')

const parseArgsIntoOpt = (arguments) => {
    const args = arg({
        "--skip": Boolean,
        "--filePath": String,
        "-s": "--skip",
        "-f": "--filePath"
    },
    {
        argv: arguments.slice(2),
    });

    return {
        hidePrompts: args["--skip"] || false,
        filePath: args._[0]
    }
}

module.exports = parseArgsIntoOpt;