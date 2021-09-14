const fs = require('fs')
const { exec } = require('child_process')
const yargs = require('yargs')
const got = require('got')
const yaml = require('js-yaml')
const Joi = require('joi')
require('dotenv').config()

const checkFilePath = async (file) => {
    return new Promise((resolve, reject) => {
        resolve(fs.existsSync(file))
    })
}

const readFileOutput = async (file) => {
    return new Promise((resolve, reject) => {
        const output = fs.readFileSync(file, 'utf-8')
        if (output === 'Valid!') {
            resolve(true)
        } else {
            reject(false)
        }
    })
}

const executeExternal = async (file) => {
    return new Promise((resolve, reject) => {
        exec(`oslo validate ${file}`, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else if (stderr) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
}

const validateSchema = () => {
    return Joi.object().keys({
        spec: Joi.object().keys({
            timeWindows: Joi.array().items(
                Joi.object({
                    unit: Joi.when('calendar', {
                        is: Joi.exist(),
                        then: Joi.string().valid('Year', 'Quarter', 'Month', 'Week', 'Day').required(),
                        otherwise: Joi.string().valid('Day', 'Hour', 'Minute').required()
                    }),
                    count: Joi.when('unit', {
                        is: 'Day',
                        then: Joi.number().integer().max(28).required()
                    }),
                    isRolling: Joi.when('calendar', {
                        is: Joi.exist(),
                        then: Joi.boolean().valid(false),
                        otherwise: Joi.boolean().valid(true).required()
                    }),
                    calendar: Joi.object().keys({
                        startTime: Joi.string().required(),
                        timeZone: Joi.string().required()
                    })
                })
            ).required().length(1),
            budgetingMethod: Joi.string().valid('Occurrences'),
            objectives: Joi.array().items(
                Joi.object().keys({
                    displayName: Joi.string().required(),
                    op: Joi.when(Joi.ref('/spec.indicator.thresholdMetric'), {
                        is: Joi.exist(),
                        then: Joi.string().valid('or').required(),
                        // otherwise:
                    }),
                    value: Joi.number().unit('ms'), // set through the Blameless SLO API
                    target: Joi.number().min(0).less(1).required(),
                    timeSliceTarget: Joi.number(),
                    // errorBudgetPolicyName: Custom Field?,
                    ratioMetric: Joi.when(Joi.ref('/spec.indicator.thresholdMetric'), {
                        not: Joi.exist(),
                        then: Joi.object().keys({
                            incremental: Joi.boolean().valid(false).required(),
                            good: Joi.object().keys({
                                source: Joi.string().valid(Joi.ref('...total.source')).required(),
                                queryType: Joi.string().valid(Joi.ref('...total.queryType')).required(),
                                query: Joi.string().valid(Joi.ref('...total.query')).required(),
                            }).required(),
                            total: Joi.object().keys({
                                source: Joi.string().required(),
                                queryType: Joi.string().required(),
                                query: Joi.string().required()
                            }).required()
                        }).required(),
                        // otherwise:
                    })
                })
            ).unique((a, b) => a.value && b.value && a.value === b.value).required().min(1)
        }).required()
    }).options({
        allowUnknown: true
    })
}

(async () => {
    try {
        // const args = yargs(process.argv.slice(2)).argv

        // const filepath = args._.length > 0 ? args._[0] : 'service.yaml'

        // const fileExists = await checkFilePath(filepath)
        
        // if (fileExists) {
        //     await executeExternal(filepath)

        //     const auth = {
        //         client_id: process.env.BLAMELESS_OAUTH_CLIENT_ID,
        //         client_secret: process.env.BLAMELESS_OAUTH_CLIENT_SECRET,
        //         audience: process.env.BLAMELESS_OAUTH_AUDIENCE,
        //         grant_type: process.env.BLAMELESS_OAUTH_GRAND_TYPE,
        //     }

        //     const tokenObj = await got.post(process.env.BLAMELESS_OAUTH_BASE, {
        //         json: auth
        //     })

        //     const { statusCode, body } = tokenObj
        //     // check the status code
        //     const token = `${JSON.parse(body)?.token_type} ${JSON.parse(body)?.access_token}`
        //     console.log(token)
        // } else {
        //     throw new Error('Please specify valid file')
        // }

        const STATUS_FILE = 'init-status'
        const YAML_FILE = 'main.yaml'

        const fileExists = await checkFilePath(STATUS_FILE)

        if (fileExists) {
            const status = await readFileOutput(STATUS_FILE)
            if (status) {
                const doc = yaml.load(fs.readFileSync(YAML_FILE, 'utf8'))
                
                Joi.attempt(doc, Joi.object())
                const schema = validateSchema()
                await schema.validateAsync(doc)
                
                // call Blameless API to set metricUnit to ms
                // call other API endpoints to create desired SLO
            } else {
                throw new Error('Invalid')
            }
        }
    } catch (err) {
        console.log(err)
    }
})()