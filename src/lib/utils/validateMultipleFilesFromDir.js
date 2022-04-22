const { logger, showErrors } = require('./')
const documentTypeChecker = require('./documentTypeChecker')
const _ = require('lodash')
const parseYamlToJson = require('./parseYamlToJson')

const validateMultiple = (files) => {
    if (!(files && files.length) && typeof files !== 'boolean') {
        logger.error(
            `There is no files provided. Please provide correct path to your folder which contains .yaml files in order to get populated files`
        )

        return false
    }

    if (files && files.length) {
        let allValidDocs = []
        let hasErrors = false
        files.forEach((file) => {
            const processedDocument = parseYamlToJson(file?.fullPath)

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
