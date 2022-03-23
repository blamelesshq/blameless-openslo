#!/usr/bin/env node

const { program } = require('commander')
const packageVersion = require('../package.json').version
const validate = require('../lib')
const help = require('../lib/utils/help')
const { allowedTypes } = require('../lib/config/constants')
const logger = require('../lib/utils/logger')
const deploy = require('../blameless-deploy/lib/cli')
const ddelete = require('../blameless-delete/lib/cli')
const envConfig = require('../lib/config/env')

const isEnvSet = require('../lib/utils/checkEnv')
// const setConfig = require('../lib/utils/setConfiguration')
// const isConfigSet = require('../lib/utils/checkConfig')
const os = require('os')
const m2mAuth = require('../blameless-deploy/handlers/shared/m2m')
const tokenUtils = require('../blameless-delete/handlers/shared/getToken')
const authTokenProvider = require('../lib/utils/authTokenProvider')

const allowedTypeOptions = (value) => {
    if (value && !allowedTypes.includes(value)) {
        logger.warn('Please specify type: Allowed options are: github | local')
        return
    }

    return value
}


if (isEnvSet()) {
    (async () => {

        const authRequest = {
            client_id: envConfig.clientId,
            client_secret: envConfig.clientSecret,
            audience: envConfig.audience,
            grant_type: envConfig.grandType
        }

        // Get a machine token to use for requests
        const authToken = await m2mAuth(authRequest)

        authTokenProvider.authToken = `Bearer ${authToken}`;

        program
            .version(packageVersion)
            .command('validate')
            .description('Validate YAML files')
            .requiredOption(
                '-s, --source <type of source>',
                'Please specify source: github or local',
                allowedTypeOptions
            )
            .requiredOption('-f,--filePath <file_name>', 'path to yaml files')
            .action((options) => {
                validate(options?.filePath, options?.source)
            })

        program
            .command('deploy')
            .description('Deploy resource to Blameless')
            .requiredOption(
                '-s, --source <type of source>',
                'Please specify source: github or local',
                allowedTypeOptions
            )
            .requiredOption('-f,--filePath <file_name>', 'path to yaml files')
            .action(() => {
                deploy(process.argv)
            })

        program
            .command('delete')
            .description('Delete resources from Blameless instance')
            .requiredOption(
                '-s, --source <type of source>',
                'Please specify source: github or local',
                allowedTypeOptions
            )
            .requiredOption('-f,--filePath <file_name>', 'path to yaml files')
            .action(() => {
                ddelete(process.argv)
            })

        if (
            process.argv.includes('-help') ||
            process.argv.includes('help') ||
            process.argv.includes('-h') ||
            process.argv.includes('--help')
        ) {
            program.addHelpText('beforeAll', help())
        }

        program.parse(process.argv)
    })()
} else {
    logger.error(
        `Config is missing. Please set correct config values via environment variables.
         Required Env Vars:
         BLAMELESS_OAUTH_CLIENT_ID
         BLAMELESS_OAUTH_CLIENT_SECRET
         BLAMELESS_OAUTH_AUDIENCE
         BLAMELESS_TENANT_DOMAIN`
    )
    // setConfig()
}



