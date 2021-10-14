const yaml = require('js-yaml')
const { logger, showErrors } = require('./')
const fs = require('fs')
const documentTypeChecker = require('./documentTypeChecker')
const _ = require('lodash')

const validateMultiple = (files) => {
    let processedDocument,
        allValidDocs = [],
        hasErrors = false

    if (!(files && files.length) && typeof files !== 'boolean') {
        logger.error(
            `There is no files provided. Please provide correct path to your folder which contains .yaml files in order to get populated files`
        )

        return false
    }

    if (files && files.length) {
        files.forEach((file) => {
            processedDocument = yaml.load(
                fs.readFileSync(file?.fullPath, 'utf-8')
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
        })

        return {
            isValid: hasErrors ? false : true,
            validDocuments: _.groupBy(allValidDocs, 'kind'),
        }
    }
}

module.exports = validateMultiple
