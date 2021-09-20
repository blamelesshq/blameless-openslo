const suggestOptions = require('./utils/promptOptions')
const parseArgsIntoOpt = require('./utils/getArgsOptions')

const cli = async (args) => {
    let options = parseArgsIntoOpt(args)
    options = await suggestOptions(options)
}

module.exports = cli
