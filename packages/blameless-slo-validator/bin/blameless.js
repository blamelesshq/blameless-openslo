#!/usr/bin/env node

const { program } = require('commander')
const packageVersion = require('../package.json').version
const validate = require('../lib')
const help = require('../lib/utils/help')

program
    .version(packageVersion)
    .command('validate')
    .requiredOption(
        '-f, --filePath <filePath>',
        'path to the source file for validating'
    )
    .action((options) => {
        const targetFile = options.targetObj
            ? JSON.parse(options.targetObj)
            : options.filePath
        validate(targetFile)
    })

if (process.argv.includes('help')) {
    help()
}

program.parse(process.argv)
