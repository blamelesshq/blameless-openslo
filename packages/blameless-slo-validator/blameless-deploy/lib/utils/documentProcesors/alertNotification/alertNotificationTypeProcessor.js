const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getErrorBudgetPolicyThresholdTypesHanlder = require('../../../../handlers/alertCondition/getErrorBudgetPolicyThresholdTypesHanlder')
const createErrorBudgetPolicyThreshold = require('../../../../handlers/alertCondition/createErrorBudgetPolicyThresholdHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const errorBudgetPolicyThresholdTypeId = async (document) => {
    const ebpThresholdTypes = await getErrorBudgetPolicyThresholdTypesHanlder()

    if (!ebpThresholdTypes) {
        throw new Error(
            `Unable to retrieve Error Budget Policy Threshold Types...`
        )
    }
    const ebpThresholdTypeId =
        ebpThresholdTypes &&
        ebpThresholdTypes.find((epbThType) =>
            epbThType.name === document?.spec?.condition?.kind &&
            document?.spec?.condition?.kind === 'percent_depleted'
                ? 'percentage'
                : 'seconds'
        )?.id

    if (!ebpThresholdTypeId) {
        throw new Error(
            `Unable to retrieve Id for EBP kind - ${document?.spec?.condition?.kind}.`
        )
    }

    return ebpThresholdTypeId
}

const threshold = (document) => {
    if (!document && document?.spec?.condition?.threshold) {
        throw new Error(`There is no threshold value`)
    }
    return document && document?.spec?.condition?.kind === 'percent_depleted'
        ? document && document?.spec?.condition?.threshold
        : document && document?.spec?.condition?.threshold * 24 * 3600
}

const createAlertCondition = async (document, inputResult) => {
    const alertConditionReq = {
        orgId: await orgId(),
        model: {
            errorBudgetPolicyThresholdTypeId:
                await errorBudgetPolicyThresholdTypeId(document),
            threshold: threshold(document),
            errorBudgetPolicyId: inputResult?.id,
        },
    }

    return await createErrorBudgetPolicyThreshold(alertConditionReq)
}

const alertNotificationTypeProcessor = async (document, inputResult) => {
    let response
    const alertConditionsSteps = new Listr([
        {
            title: 'Creating Alert Condition',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting Org Id ...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting Error Budget Policy Threshold TypeId ...',
                            task: async () =>
                                await errorBudgetPolicyThresholdTypeId(
                                    document
                                ).catch((err) => {
                                    throw new Error(err)
                                }),
                        },
                        {
                            title: 'Getting Threshold ...',
                            task: () => threshold(document),
                        },
                        {
                            title: 'Creating Alert Condition....',
                            task: async () =>
                                await createAlertCondition(
                                    document,
                                    inputResult
                                )
                                    .then((result) => {
                                        response = result
                                    })
                                    .catch((err) => {
                                        throw new Error(err)
                                    }),
                        },
                    ],
                    { concurrent: true, exitOnError: false }
                )
            },
        },
    ])
    try {
        await alertConditionsSteps.run()
        logger.infoSuccess(
            `RESOURCE WAS CREATED SUCCESSFULLY. RESPONSE: ${JSON.stringify(
                response
            )}`
        )
    } catch (err) {
        logger.infoError(
            'ERRORS:',
            err?.errors
                ?.toString()
                .split(',')
                .filter((c, index) => {
                    return (
                        err?.errors?.toString().split(',').indexOf(c) === index
                    )
                })
        )
    }
    return response ? response : false
}

module.exports = alertNotificationTypeProcessor
