const yaml = require('js-yaml')
const { logger, showErrors } = require('./')
const fs = require('fs')
const documentTypeChecker = require('./documentTypeChecker')
const _ = require('lodash')
const getContentFromGithubRepo = require('./getContentFromGithubRepository')
const isItYaml = require('./isItYaml')

const validateGithubMultiple = (files) => {
    let allValidDocs = [],
        hasErrors = false

    if (!files && typeof files !== 'boolean') {
        logger.error(
            `There is no files provided. Please provide correct path to your folder which contains .yaml files in order to get populated files`
        )

        return false
    }

    if (files && files.length === 1) {
        if (isItYaml(files?.path)) {
            const processedDocument = yaml.load(
                Buffer.from(files?.content, 'base64').toString('utf-8')
            )
            const documentType = documentTypeChecker(
                processedDocument?.kind &&
                    processedDocument?.kind.toLowerCase(),
                processedDocument
            )
            if (documentType && documentType?.error) {
                showErrors(
                    documentType?.error?.details,
                    processedDocument?.kind
                )
                hasErrors = true
            }
            if (
                documentType &&
                documentType?.error == null &&
                documentType?.value
            ) {
                showErrors(
                    documentType?.error?.details,
                    processedDocument?.kind
                )
                allValidDocs.push(documentType?.value)
            }
        }
    }

    if (files && files.length) {
        files.forEach(async (file) => {
            if (isItYaml(file?.path)) {
                const document = await getContentFromGithubRepo(file?.path)
                const processedDocument = yaml.load(
                    Buffer.from(document?.content, 'base64').toString('utf-8')
                )

                const documentType = documentTypeChecker(
                    processedDocument?.kind &&
                        processedDocument?.kind.toLowerCase(),
                    processedDocument
                )

                if (documentType && documentType?.error) {
                    showErrors(
                        documentType?.error?.details,
                        processedDocument?.kind
                    )
                    hasErrors = true
                }

                if (
                    documentType &&
                    documentType?.error == null &&
                    documentType?.value
                ) {
                    showErrors(
                        documentType?.error?.details,
                        processedDocument?.kind
                    )
                    allValidDocs.push(documentType?.value)
                }
            }
        })
    }

    return {
        isValid: hasErrors ? false : true,
        validDocuments:
            allValidDocs && allValidDocs?.length
                ? _.groupBy(allValidDocs, 'kind')
                : null,
    }
}

module.exports = validateGithubMultiple
