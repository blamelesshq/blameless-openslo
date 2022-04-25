#!/usr/bin/env node

const { program } = require('commander')
const packageVersion = require('../../package.json').version
const cli = require('../lib/cli')
const { allowedTypes } = require('../lib/config/constants')

const allowedTypeOptions = (value) => {
    if (value && !allowedTypes.includes(value)) {
        logger.warn('Please specify type: Allowed options are: github | local')
        return
    }

    return value
}

program
    .version(packageVersion)
    .command('delete')
    .description('Delete resources from Blameless instance')
    .requiredOption(
        '-s, --source <type of source>',
        'Please specify source: github or local',
        allowedTypeOptions
    )
    .requiredOption('-f,--filePath <file_name>', 'path to yaml files')
    .action(() => {
        cli(process.argv)
    })

program.parse(process.argv)
