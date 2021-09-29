const suggestOptions = require('./utils/promptOptions')
const parseArgsIntoOpt = require('./utils/getArgsOptions')
const createResources = require('./main')

const cli = async (args) => {
    let options = parseArgsIntoOpt(args)
    options = await suggestOptions(options)
    //await createResources(options)
}

module.exports = cli
