const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getErrorBudgetPolicyActions = require('../../../../handlers/alertNotificationTarget/getErrorBudgetPolicyActionsHandler')
const getErrorBudgetPoliciesHandler = require('../../../../handlers/errorBudgetPolicy/getErrorBudgetPoliciesHandler')
const deleteErrorBudgetPolicyHandler = require('../../../../handlers/errorBudgetPolicy/deleteErrorBudgetPolicyHandler')
const getErrorBudgetPolicyThresholdsHandler = require('../../../../handlers/alertCondition/getErrorBudgetPolicyThresholdsHandler')
const deleteErrorBudgetPolicyThresholdsHandler = require('../../../../handlers/alertCondition/deleteErrorBudgetPolicyThresholdsHandler')
const deleteErrorBudgetPolicyActionHandler = require('../../../../handlers/alertNotificationTarget/deleteErrorBudgetPolicyActionHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const getEbpId = async (document) => {
    const [ebps] = await Promise.all([getErrorBudgetPoliciesHandler()])

    const result =
        ebps &&
        ebps.find(
            (ebp) =>
                ebp?.name?.toLowerCase() ===
                document?.metadata?.name?.toLowerCase()
        )?.id

    if (!result) {
        throw `Unable to find EBP with name ${document?.metadata?.name}. Please make sure that EBP has been already created`
    }

    return result
}

const deleteEbp = async (document) => {
    const [oId, ebpId] = await Promise.all([orgId(), getEbpId(document)])

    const deleteEbpReq = {
        orgId: oId,
        id: ebpId,
    }

    const result = await deleteErrorBudgetPolicyHandler(deleteEbpReq)
    return result
}

const ebpThresholdId = async (document) => {
    const [ebpThresholds, ebpId] = await Promise.all([
        getErrorBudgetPolicyThresholdsHandler(),
        getEbpId(document),
    ])

    const result =
        ebpThresholds &&
        ebpThresholds.find((ebpT) => ebpT?.errorBudgetPolicyId === ebpId)?.id
    return result
}

const deleteEbpThreshold = async (document) => {
    const [oId, ebpThId] = await Promise.all([
        orgId(),
        ebpThresholdId(document),
    ])

    const deleteEbpThresholdReq = {
        id: oId,
        id: ebpThId,
    }

    const result = await deleteErrorBudgetPolicyThresholdsHandler(
        deleteEbpThresholdReq
    )
    return result
}

const policyActionId = async (document) => {
    const [oId, ebpId, ebpas] = await Promise.all([
        orgId(),
        ebpThresholdId(document),
        getErrorBudgetPolicyActions({ orgId: orgId() }),
    ])
    const result =
        ebpas &&
        ebpas.find((ebpa) => ebpa?.errorBudgetPolicyThresholdId === ebpId)?.id
    return result
}

const deletePolicyAction = async (document) => {
    const [oId, paId] = await Promise.all([orgId(), policyActionId(document)])

    const deletePolicyActionReq = {
        orgId: oId,
        id: paId,
    }

    const result = await deleteErrorBudgetPolicyActionHandler(
        deletePolicyActionReq
    )
    return result
}

const errorBudgetPolicyTypeProcessor = async (document, inputResult) => {
    let response

    const ebpSteps = new Listr([
        {
            title: 'Deleting EBP ...',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId ...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting EBP Id ...',
                            task: async () => {
                                await getEbpId(document)
                            },
                        },
                        {
                            title: 'Deleting EBP ...',
                            task: async () => {
                                await deleteEbp(document)
                            },
                        },
                        {
                            title: `Finding Threshold associated with EBP ${document?.metadata?.name} ...`,
                            task: async () => {
                                await ebpThresholdId(document)
                            },
                        },
                        {
                            title: `Deleting Threshold associated with EBP ${document?.metadata?.name} ...`,
                            task: async () => {
                                await deleteEbpThreshold(document)
                            },
                        },
                        {
                            title: `Finding Policy Action associated with EBP ${document?.metadata?.name} ...`,
                            task: async () => {
                                await policyActionId(document)
                            },
                        },
                        {
                            title: `Deleting Policy Action associated with EBP ${document?.metadata?.name} ...`,
                            task: async () => {
                                await deletePolicyAction(document).then(
                                    (result) => {
                                        response = result
                                    }
                                )
                            },
                        },
                    ],
                    { concurrent: true, exitOnError: false }
                )
            },
        },
    ])
    try {
        await ebpSteps.run()
        logger.infoSuccess(
            `SUCCESSFULLY DELETED EBP: ${
                JSON.stringify(response?.name)
                    ? JSON.stringify(response?.name)
                    : document?.metadata?.name
            }`
        )
    } catch (err) {
        logger.infoError(
            'ERRORS:',
            err?.errors
                ?.toString()
                .split(',')
                .filter(
                    (c, index) =>
                        err?.errors?.toString().split(',').indexOf(c) === index
                )
        )
    }
    return response ? response : false
}

module.exports = errorBudgetPolicyTypeProcessor
