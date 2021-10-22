const os = require('os')
const fs = require('fs')
const logger = require('./logger')
const inquirer = require('inquirer')

/**
 * Create global config directory
 * @param {String} path - path to config directory
 * @returns boolean
 */
const createDirectory = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true }, (err) => {
            if (err) {
                logger.error(
                    `An error occurred while creating config directory: ${err}`
                )
                return false
            } else {
                logger.success('Config directory has been created...')
                return true
            }
        })
    }

    return true
}

const merge = (obj = {}, defaults) => {
    for (const key in defaults) {
        if (typeof obj[key] === 'undefined') {
            obj[key] = defaults[key]
        }
    }
    return obj
}

const isBase64 = (str, options) => {
    const notBase64 = /[^A-Z0-9+\/=]/i
    const urlSafeBase64 = /^[A-Z0-9_\-]*$/i

    const defaultBase64Options = {
        urlSafe: false,
    }

    options = merge(options, defaultBase64Options)
    const len = str.length

    if (options.urlSafe) {
        return urlSafeBase64.test(str)
    }

    if (len % 4 !== 0 || notBase64.test(str)) {
        return false
    }

    const firstPaddingChar = str.indexOf('=')
    return (
        firstPaddingChar === -1 ||
        firstPaddingChar === len - 1 ||
        (firstPaddingChar === len - 2 && str[len - 1] === '=')
    )
}

/**
 *
 * @param {String} path - Path to config file
 */
const createConfigFile = async (path) => {
    let requiredConfiguration = []
    requiredConfiguration.push(
        {
            type: 'input',
            name: 'BLAMELESS_TENANT_BASE_URL',
            message: 'Please set BLAMELESS_TENANT_BASE_URL: ',
            validate: (BLAMELESS_TENANT_BASE_URL) => {
                const containsBlamelessDomainUrl =
                    BLAMELESS_TENANT_BASE_URL.includes('.blameless.io/api/v1/')

                const containsHttps =
                    BLAMELESS_TENANT_BASE_URL.includes('https')

                if (containsBlamelessDomainUrl && containsHttps) {
                    console.log('  ✓ Valid!')
                    return true
                } else {
                    console.log(
                        ' ✘ Please enter valid BLAMELESS_TENANT_BASE_URL'
                    )
                    return false
                }
            },
        },
        {
            type: 'input',
            name: 'BLAMELESS_TEMP_AUTH_TOKEN',
            message: 'Please set BLAMELESS_TEMP_AUTH_TOKEN: ',
            validate: (BLAMELESS_TEMP_AUTH_TOKEN) => {
                const splitted =
                    BLAMELESS_TEMP_AUTH_TOKEN &&
                    BLAMELESS_TEMP_AUTH_TOKEN.split('.')

                if (splitted.length > 3 || splitted.length < 2) {
                    console.log(
                        ' ✘ Please enter valid BLAMELESS_TEMP_AUTH_TOKEN'
                    )
                    return false
                }

                return splitted.reduce(
                    (acc, currElem) =>
                        acc && isBase64(currElem, { urlSafe: true }),
                    true
                )
            },
        },
        {
            type: 'input',
            name: 'REPOSITORY_PAT',
            message: 'Please set REPOSITORY_PERSONAL_ACCESS_TOKEN: ',
            validate: (REPOSITORY_PERSONAL_ACCESS_TOKEN) => {
                const containsGhp =
                    REPOSITORY_PERSONAL_ACCESS_TOKEN.startsWith('ghp_')

                if (containsGhp) {
                    console.log('  ✓ Valid!')
                    return true
                } else {
                    console.log(
                        ' ✘ Please enter valid REPOSITORY_PERSONAL_ACCESS_TOKEN'
                    )
                    return false
                }
            },
        },
        {
            type: 'input',
            name: 'REPOSITORY_OWNER',
            message: 'Please set REPOSITORY_OWNER: ',
        },
        {
            type: 'input',
            name: 'REPOSITORY_NAME',
            message: 'Please set REPOSITORY_NAME: ',
        }
    )

    const answer = await inquirer.prompt(requiredConfiguration)
    const rootConfigFolder = createDirectory(path)

    if (!rootConfigFolder) {
        createDirectory(path)
    }
    if (rootConfigFolder && answer) {
        const configPath =
            os.platform() === 'darwin'
                ? `${path}//config.json`
                : `${path}\\config.json`
        fs.writeFile(configPath, JSON.stringify(answer, null, 2), (err) => {
            if (err) {
                logger.error(`An error occurred while adding config: ${err}`)
            } else {
                logger.success(`Config has been created`)
                logger.success(
                    'Please type blameless-slo and choose command in your terminal'
                )
            }
        })
    }
}

const setConfig = async () => {
    const path =
        os.platform() === 'darwin'
            ? `${os.homedir()}//.blameless-slo`
            : `${os.homedir()}\\.blameless-slo`

    createDirectory(path)
    await createConfigFile(path)
}

module.exports = setConfig
