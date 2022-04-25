const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const createErrorBudgetPolicyHandler = require('../../../../handlers/errorBudgetPolicy/createErrorBudgetPolicyHandler')
const getErrorBudgetPolicyThresholdTypesHanlder = require('../../../../handlers/alertCondition/getErrorBudgetPolicyThresholdTypesHanlder')
const createErrorBudgetPolicyThreshold = require('../../../../handlers/alertCondition/createErrorBudgetPolicyThresholdHandler')
const createErrorBudgetPolicyAction = require('../../../../handlers/alertNotificationTarget/createErrorBudgetPolicyActionHandler')
const getErrorBudgetPolicyActionsType = require('../../../../handlers/alertNotificationTarget/getErrorBudgetPolicyActionTypesHandler')
const getUserId = require('../../../../handlers/shared/getUserId')
const incidentSeverities = require('../../../../handlers/shared/incidentSeverities')
const getErrorBudgetPoliciesHandler = require('../../../../handlers/errorBudgetPolicy/getErrorBudgetPoliciesHandler')
const getErrorBudgetPolicyThresholdsHandler = require('../../../../handlers/alertCondition/getErrorBudgetPolicyThresholdsHandler')
const updateErrorBudgetPolicyHandler = require('../../../../handlers/errorBudgetPolicy/updateErrorBudgetPolicyHandler')
const _ = require('lodash')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const ebpName = (document) => {
    return document && document?.metadata?.name
}

const ebpDescription = (document) => {
    return document && document?.spec?.description
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
        ebpThresholdTypes.find(
            (epbThType) =>
                epbThType.name ===
                (document?.spec.notificationPolicies[
                    document?.spec?.notificationPolicies?.length - 1
                ]?.thresholdType == 'percent_depleted'
                    ? 'percentage'
                    : 'seconds')
        )?.id

    return ebpThresholdTypeId
}

const threshold = (document) => {
    if (
        !document &&
        document?.spec.notificationPolicies[
            document?.spec?.notificationPolicies?.length - 1
        ]?.threshold
    ) {
        throw new Error(`There is no threshold value`)
    }
    return document &&
        document?.spec.notificationPolicies[
            document?.spec?.notificationPolicies?.length - 1
        ]?.thresholdType == 'percent_depleted'
        ? document?.spec.notificationPolicies[
              document?.spec?.notificationPolicies?.length - 1
          ]?.threshold
        : document?.spec.notificationPolicies[
              document?.spec?.notificationPolicies?.length - 1
          ]?.threshold *
              24 *
              3600
}

const errorBudgetPolicyActionTypeId = async (source) => {
    const errorBudgetPolicyActionTypes = await getErrorBudgetPolicyActionsType()

    const mappedSource = {
        email: 'notify_email',
        slack: 'notify_slack',
        teams: 'notify_msteams',
        incident: 'blameless_incident',
    }

    if (!mappedSource[source]) {
        return
    }

    return {
        id:
            errorBudgetPolicyActionTypes &&
            errorBudgetPolicyActionTypes.find(
                (ebpat) => ebpat.name === mappedSource[source]
            )?.id,
        type: source,
    }
}

const generateActionMetadata = async (document, actIdType) => {
    if (actIdType && actIdType === 'email') {
        let userIds = []
        const emails =
            document?.spec?.notificationPolicies[
                document?.spec?.notificationPolicies?.length - 1
            ]?.notifications?.email

        for (let i = 0; i < emails.length; i++) {
            userIds.push(await getUserId(emails[i]))
        }

        return JSON.stringify({
            blamelessUserIDs: userIds.map(String),
        })
    }

    if (actIdType && actIdType === 'incident') {
        const incidents = await incidentSeverities()
        const incidentId =
            incidents &&
            incidents.find(
                (inc) =>
                    inc?.name ===
                    document?.spec?.notificationPolicies[
                        document?.spec?.notificationPolicies?.length - 1
                    ]?.notifications?.incident?.severity
            )?.id

        return JSON.stringify({
            type: 'DEFAULT',
            severity: incidentId.toString(),
        })
    }

    if (actIdType && actIdType === 'teams') {
        return JSON.stringify({})
    }

    if (actIdType && actIdType === 'slack') {
        return JSON.stringify({})
    }
}

const createErrorBudgetPolicy = async (document) => {
    const [ebpThresholds, ebpPolicies, oId, ebpThresholdTypeId] =
        await Promise.all([
            getErrorBudgetPolicyThresholdsHandler(),
            getErrorBudgetPoliciesHandler(),
            orgId(),
            errorBudgetPolicyThresholdTypeId(document),
        ])

    const ebpRequest = {
        orgId: oId,
        model: {
            name: ebpName(document),
            description: ebpDescription(document),
        },
    }

    const notifications =
        document?.spec?.notificationPolicies[
            document?.spec?.notificationPolicies?.length - 1
        ]?.notifications

    const notificationTypes = Object.keys(notifications)

    const findMatchingEbpTTid = async (element) =>
        element?.errorBudgetPolicyThresholdTypeId === ebpThresholdTypeId

    const exist =
        ebpPolicies && ebpPolicies.find((ebp) => ebp.name === ebpName(document))

    const isEBPDescUpdated = !(
        exist && exist?.description == ebpDescription(document)
    )

    if (exist && !isEBPDescUpdated) {
        logger.warn(
            `EBP name: "${ebpName(document)}" ID: ${exist?.id} already exist.`
        )
        logger.warn(
            `Description for EBP name: "${ebpName(
                document
            )}" has not been updated. Current description: ${ebpDescription(
                document
            )}`
        )

        throw new Error(
            `EBP name: "${ebpName(document)}" ID: ${
                exist?.id
            } already exist. Description for EBP name: "${ebpName(
                document
            )}" has not been updated. Current description: ${ebpDescription(
                document
            )}`
        )
    }

    if (exist && isEBPDescUpdated) {
        logger.warn(
            `EBP name: "${ebpName(document)}" ID: ${
                exist?.id
            } already exist. Update was detected.\n\n * Current value: ${
                exist?.description
            }\n * New value: ${ebpDescription(document)}\n`
        )

        await updateErrorBudgetPolicyHandler({
            ...ebpRequest,
            id: exist?.id,
        }).then(async (result) => {
            logger.info(`EPB ${result?.name} has been updated.`)
            const alertConditionRequest = {
                orgId: result?.orgId,
                model: {
                    errorBudgetPolicyThresholdTypeId: ebpThresholdTypeId,
                    threshold: threshold(document),
                    errorBudgetPolicyId: result?.id,
                },
            }

            const isThresholdExist =
                ebpThresholds &&
                ebpThresholds.find(
                    (ebpt) => ebpt?.threshold === threshold(document)
                )

            const hasAlreadyCreatedPairOfThresholdAndEbpTid =
                ebpThresholds.some(findMatchingEbpTTid) && isThresholdExist

            if (hasAlreadyCreatedPairOfThresholdAndEbpTid) {
                logger.warn(
                    `Unable to create Notification Policy. Reason: Duplicate matching pair: \n
                    * ThresholdTypeId ${ebpThresholdTypeId}\n
                    * Threshold ${isThresholdExist?.threshold}`
                )

                throw new Error(`Unable to create Notification Policy. Reason: Duplicate matching pair: \n
                * ThresholdTypeId ${ebpThresholdTypeId}\n
                * Threshold ${isThresholdExist?.threshold}`)
            }

            await createErrorBudgetPolicyThreshold(alertConditionRequest).then(
                async (result) => {
                    for (let i = 0; i <= notificationTypes.length; i++) {
                        const actId = await errorBudgetPolicyActionTypeId(
                            notificationTypes[i]
                        )

                        const cleanActId = _.pickBy(
                            actId,
                            (v) => v !== undefined
                        )

                        if (cleanActId) {
                            const metadata = await generateActionMetadata(
                                document,
                                cleanActId.type
                            )

                            const errorBudgetActionReq = {
                                orgId: result?.errorBudgetPolicyThreshold
                                    ?.orgId,
                                model: {
                                    errorBudgetPolicyThresholdId:
                                        result?.errorBudgetPolicyThreshold?.id,
                                    errorBudgetPolicyActionTypeId: actId?.id,
                                    isEnabled: true,
                                    actionMetadata: metadata,
                                },
                            }

                            await createErrorBudgetPolicyAction(
                                errorBudgetActionReq
                            )
                        }
                    }
                }
            )
        })
    } else {
        await createErrorBudgetPolicyHandler(ebpRequest).then(
            async (result) => {
                const alertConditionRequest = {
                    orgId: result?.orgId,
                    model: {
                        errorBudgetPolicyThresholdTypeId: ebpThresholdTypeId,
                        threshold: threshold(document),
                        errorBudgetPolicyId: result?.id,
                    },
                }

                const isThresholdExist =
                    ebpThresholds &&
                    ebpThresholds.find(
                        (ebpt) => ebpt?.threshold === threshold(document)
                    )

                const hasAlreadyCreatedPairOfThresholdAndEbpTid =
                    ebpThresholds.some(findMatchingEbpTTid) && isThresholdExist

                if (hasAlreadyCreatedPairOfThresholdAndEbpTid) {
                    logger.warn(
                        `Unable to create Notification Policy. Reason: Duplicate matching pair: \n
                            * ThresholdTypeId ${ebpThresholdTypeId}\n
                            * Threshold ${isThresholdExist?.threshold}`
                    )
                    return
                }

                await createErrorBudgetPolicyThreshold(
                    alertConditionRequest
                ).then(async (result) => {
                    for (let i = 0; i <= notificationTypes.length; i++) {
                        const actId = await errorBudgetPolicyActionTypeId(
                            notificationTypes[i]
                        )

                        const cleanActId = _.pickBy(
                            actId,
                            (v) => v !== undefined
                        )

                        let errorBudgetActionReq

                        if (cleanActId) {
                            const metadata = await generateActionMetadata(
                                document,
                                cleanActId.type
                            )

                            errorBudgetActionReq = {
                                orgId: result?.errorBudgetPolicyThreshold
                                    ?.orgId,
                                model: {
                                    errorBudgetPolicyThresholdId:
                                        result?.errorBudgetPolicyThreshold?.id,
                                    errorBudgetPolicyActionTypeId: actId?.id,
                                    isEnabled: true,
                                    actionMetadata: metadata,
                                },
                            }
                        }

                        await createErrorBudgetPolicyAction(
                            errorBudgetActionReq
                        )
                    }
                })
            }
        )
    }
}

const errorBudgetPolicyTypeProcessor = async (document, inputResult) => {
    let response

    const ebpSteps = new Listr([
        {
            title: 'Creating EBP...',
            task: async () =>
                await createErrorBudgetPolicy(document)
                    .then((result) => (response = result))
                    .catch((err) => {
                        throw new Error(err)
                    }),
        },
    ])
    try {
        await ebpSteps.run()
        logger.infoSuccess(
            `SUCCESSFULLY CREATED: ${JSON.stringify(response?.name)}`
        )
    } catch (err) {
        logger.infoError(
            'ERRORS:',
            err?.errors
                ? err?.errors
                      ?.toString()
                      .split(',')
                      .filter((c, index) => {
                          return (
                              err?.errors?.toString().split(',').indexOf(c) ===
                              index
                          )
                      })
                : err.toString().replace('Error: Error: ', '')
        )
    }
    return response ? response : false
}

module.exports = errorBudgetPolicyTypeProcessor
