#!/usr/bin/env node

const { program } = require('commander')
const packageVersion = require('../package.json').version
const validate = require('../lib')
const help = require('../lib/utils/help')

program
    .version(packageVersion)
    .command('validate', { isDefault: true })
    .requiredOption(
        '-f, --filePath <filePath>',
        'path to the source file for validating'
    )
    .action((options) => {
        validate(options.filePath)
    })

if (
    process.argv.includes('-help') ||
    process.argv.includes('help') ||
    process.argv.includes('-h') ||
    process.argv.includes('--help')
) {
    help()
}

program.parse(process.argv)
