#!/usr/bin/env node

const { program } = require('commander')
const packageVersion = require('../package.json').version
const validate = require('../lib')
const help = require('../lib/utils/help')
const { allowedTypes } = require('../lib/config/constants')
const logger = require('../lib/utils/logger')
const deploy = require('../blameless-deploy/lib/cli')
const ddelete = require('../blameless-delete/lib/cli')
const setConfig = require('../lib/utils/setConfiguration')
const isConfigSet = require('../lib/utils/checkConfig')
const os = require('os')

const allowedTypeOptions = (value) => {
    if (value && !allowedTypes.includes(value)) {
        logger.warn('Please specify type: Allowed options are: github | local')
        return
    }

    return value
}

if (isConfigSet()) {
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
} else {
    logger.error(
        `Config is missing. Please set correct config values.
         If you enter an incorrect configuration value by mistake you can change
         it to the following location ${os.homedir()}`
    )

    setConfig()
}
