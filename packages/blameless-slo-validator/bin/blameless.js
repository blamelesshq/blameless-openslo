#!/usr/bin/env node

const { program } = require('commander')
const packageVersion = require('../package.json').version
const validate = require('../lib')
const help = require('../lib/utils/help')
const { allowedTypes } = require('../lib/config/constants')
const logger = require('../lib/utils/logger')
const cli = require('../../blameless-cli/lib/cli')

const allowedTypeOptions = (value) => {
    if (value && !allowedTypes.includes(value)) {
        logger.warn('Please specify type: Allowed options are: github | local')
        return
    }

    return value
}

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
        cli(process.argv)
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
