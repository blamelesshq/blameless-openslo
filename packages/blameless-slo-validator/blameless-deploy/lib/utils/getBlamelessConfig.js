const os = require('os')
const fs = require('fs')
const path = require('path')
const logger = require('../utils/logger')

const getBlamelessConfig = () => {
    const userHomeDirectory =
        os.platform() === 'darwin'
            ? `${os.homedir()}//.blameless-slo`
            : `${os.homedir()}\\.blameless-slo`

    const file = fs.readFileSync(path.resolve(userHomeDirectory, 'config.json'))

    if (!file) {
        logger.info(
            `Missing config. Please make sure that config is set. Location ${userHomeDirectory}`
        )
    } else {
        return JSON.parse(file)
    }
}

module.exports = getBlamelessConfig
