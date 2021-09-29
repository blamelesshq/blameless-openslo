const validationResult = require('./validationResult')
const sliSchema = require('../schema/sliSchema')
const sloSchema = require('../schema/sloSchema')
const userJorneySchema = require('../schema/userJourneySchema')
const serviceSchema = require('../schema/serviceSchema')
const errorBudgetPolicySchema = require('../schema/errorBudgetPolicySchema')
const alertPolicySchema = require('../schema/alertPolicySchema')
const alertNotificationSchema = require('../schema/alertNotificationSchema')
const alertConditionSchema = require('../schema/alertConditionSchema')

const documentTypeChecker = (type, document) => {
    const yamlSpecifications = {
        sli: validationResult(document, sliSchema),
        slo: validationResult(document, sloSchema),
        userjurney: validationResult(document, userJorneySchema),
        service: validationResult(document, serviceSchema),
        errorbudgetpolicy: validationResult(document, errorBudgetPolicySchema),
        alertpolicy: validationResult(document, alertPolicySchema),
        alertnotificationtarget: validationResult(
            document,
            alertNotificationSchema
        ),
        alertcondition: validationResult(document, alertConditionSchema),
    }
    return yamlSpecifications[type]
}

module.exports = documentTypeChecker
