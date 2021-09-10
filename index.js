const fs = require('fs')
const { exec } = require('child_process')
const yargs = require('yargs')
const got = require('got')
require('dotenv').config()

const checkFilePath = async (file) => {
    return new Promise((resolve, reject) => {
        resolve(fs.existsSync(file))
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

(async () => {
    try {
        const args = yargs(process.argv.slice(2)).argv

        const filepath = args._.length > 0 ? args._[0] : 'service.yaml'

        const fileExists = await checkFilePath(filepath)
        
        if (fileExists) {
            await executeExternal(filepath)

            const auth = {
                client_id: process.env.BLAMELESS_OAUTH_CLIENT_ID,
                client_secret: process.env.BLAMELESS_OAUTH_CLIENT_SECRET,
                audience: process.env.BLAMELESS_OAUTH_AUDIENCE,
                grant_type: process.env.BLAMELESS_OAUTH_GRAND_TYPE,
            }

            const tokenObj = await got.post(process.env.BLAMELESS_OAUTH_BASE, {
                json: auth
            })

            const { statusCode, body } = tokenObj
            // check the status code
            const token = `${JSON.parse(body)?.token_type} ${JSON.parse(body)?.access_token}`
            console.log(token)
        } else {
            throw new Error('Please specify valid file')
        }
    } catch (err) {
        console.log(err)
    }
})()