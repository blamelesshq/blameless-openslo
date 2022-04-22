const os = require('os')
const fs = require('fs')

/**
 * Check if the configuration is set before exec the cli
 * @returns boolean
 */
const isConfigSet = () => {
    const rootDirPath =
        os.platform() === 'darwin'
            ? `${os.homedir()}//.blameless-slo`
            : `${os.homedir()}\\.blameless-slo`

    const configPath =
        os.platform() === 'darwin'
            ? `${rootDirPath}//config.json`
            : `${rootDirPath}\\config.json`

    return fs.existsSync(rootDirPath) && fs.existsSync(configPath)
}

module.exports = isConfigSet
