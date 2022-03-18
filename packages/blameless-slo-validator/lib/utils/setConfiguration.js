const os = require('os')
const fs = require('fs')
const logger = require('./logger')
const inquirer = require('inquirer')
const envConfig = require('../config/env')
const m2mAuth = require('../../blameless-deploy/handlers/shared/m2m')

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

/**
 * Helper method to get audience from tenant domain
 * @param {String} url - Url to get audience
 */
const getAudienceFromTenantDomain = (url) => {
    const urlWithoutProtocol = url.replace(/^https?:\/\//, '')
    return urlWithoutProtocol.endsWith('/')
        ? urlWithoutProtocol.slice(0, -1)
        : urlWithoutProtocol
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
            name: 'BLAMELESS_TENANT_DOMAIN',
            message: 'Please set BLAMELESS_TENANT_DOMAIN:',
            validate: (BLAMELESS_TENANT_DOMAIN) => {
                const containsBlamelessDomainUrl =
                    BLAMELESS_TENANT_DOMAIN.includes('.blameless.io/')

                const containsHttps = BLAMELESS_TENANT_DOMAIN.includes('https')

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
            name: 'BLAMELESS_OAUTH_CLIENT_SECRET',
            message: 'Please set BLAMELESS_OAUTH_CLIENT_SECRET: ',
        },
        {
            type: 'input',
            name: 'BLAMELESS_OAUTH_CLIENT_ID',
            message: 'Please set BLAMELESS_OAUTH_CLIENT_ID: ',
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
    let answerWithAuth = {
        ...answer,
        BLAMELESS_OAUTH_AUDIENCE: getAudienceFromTenantDomain(
            answer.BLAMELESS_TENANT_DOMAIN
        ),
    }

    const authRequest = {
        client_id: answerWithAuth.BLAMELESS_OAUTH_CLIENT_ID,
        client_secret: answerWithAuth.BLAMELESS_OAUTH_CLIENT_SECRET,
        audience: answerWithAuth.BLAMELESS_OAUTH_AUDIENCE,
        grant_type: envConfig.grandType
    }

    const authToken =  await m2mAuth(authRequest)

    answerWithAuth = {
        ...answerWithAuth,
        BLAMELESS_TEMP_AUTH_TOKEN: `Bearer ${authToken}`,
    }

    if (!rootConfigFolder) {
        createDirectory(path)
    }
    if (rootConfigFolder && answer) {
        const configPath =
            os.platform() === 'darwin'
                ? `${path}//config.json`
                : `${path}\\config.json`
        fs.writeFile(
            configPath,
            JSON.stringify(answerWithAuth, null, 2),
            (err) => {
                if (err) {
                    logger.error(
                        `An error occurred while adding config: ${err}`
                    )
                } else {
                    logger.success(`Config has been created`)
                    logger.success(
                        'Please type blameless-slo and choose command in your terminal'
                    )
                }
            }
        )
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
