const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getUserId = require('../../../../handlers/shared/getUserId')
const getSliByNameHandler = require('../../../../handlers/slis/getSliByNameHandler')
const getUserJourneysHandler = require('../../../../handlers/userJourney/getUserJourneysHandler')
const createSLOHandler = require('../../../../handlers/slo/createSLOHandler')
const sloStatusesHandler = require('../../../../handlers/slo/getSLOStatusesHandler')
const getSloComparisonOperatorsHandlers = require('../../../../handlers/slo/getSloComparisonOperatorsHandlers')
const getSloMetricUnitTypesHandler = require('../../../../handlers/slo/getSloMetricUnitTypesHandler')
const getErrorBudgetPolicyHandler = require('../../../../handlers/errorBudgetPolicy/getErrorBudgetPoliciesHandler')
const getSLOsHandler = require('../../../../handlers/slo/getSLOsHandler')
const updateSLOHandler = require('../../../../handlers/slo/updateSLOHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const userId = async (document) => {
    const result = await getUserId(document?.spec?.owner)
    return result
}

const getSloName = (document) => {
    return document && document?.metadata?.name
}

const getSloStatus = async (document) => {
    const sloStatuses = await sloStatusesHandler()
    const matchingSloId =
        sloStatuses &&
        sloStatuses.find(
            (item) =>
                item?.name &&
                item?.name?.toLowerCase() ===
                    document?.spec?.sloStatus?.toLowerCase()
        )?.id

    return matchingSloId ? matchingSloId : null
}

const getSloObjectives = (document) => {
    return document && document?.spec && document?.spec?.target
}

const getSliName = async (document) => {
    const sli = await getSliByNameHandler(document?.spec?.sliName)

    if (!sli?.id) {
        throw new Error(
            `SLI with name ${document?.spec?.sliName} does not exist. Please make sure that SLI is already created before try to create SLO.`
        )
    }

    return sli.id
}

const getJourneyId = async (document) => {
    const [oId] = await Promise.all([orgId()])

    const userJourneys = await getUserJourneysHandler({
        orgId: oId,
    })

    const matchingSliId =
        userJourneys &&
        userJourneys.find(
            (item) =>
                item?.name &&
                item?.name?.toLowerCase() ===
                    document?.metadata?.userJourney?.toLowerCase()
        )?.id
    if (matchingSliId) {
        return matchingSliId
    }
}

const getComparisonOp = async (opType) => {
    const comparisonOperators = await getSloComparisonOperatorsHandlers()

    const selectedOp =
        opType === 'lte'
            ? '<='
            : opType === 'gte'
            ? '>='
            : opType === 'lt'
            ? '<'
            : opType === 'gt'
            ? '>'
            : null

    return (
        comparisonOperators &&
        comparisonOperators.find((op) => op?.operator === selectedOp)?.id
    )
}

const getMetricUnit = async (document) => {
    const metricTypes = await getSloMetricUnitTypesHandler()

    return (
        metricTypes &&
        metricTypes.find(
            (mt) => mt?.abbreviation === document?.spec?.valueMetric
        )?.id
    )
}

const errorBudgetPolicy = async (document) => {
    const errorBudgetPolicies = await getErrorBudgetPolicyHandler()

    return errorBudgetPolicies &&
        errorBudgetPolicies.find(
            (ebp) => ebp.name === document?.spec?.errorBudgetPolicyName
        )?.id
        ? errorBudgetPolicies &&
              errorBudgetPolicies.find(
                  (ebp) => ebp.name === document?.spec?.errorBudgetPolicyName
              )?.id
        : null
}

const createSlo = async (document, inputResult) => {
    const [uId, sloStatus, operator, mUnit, ebpId, sId, uJourneyId, oId, slos] =
        await Promise.all([
            userId(document),
            getSloStatus(document),
            getComparisonOp(document?.spec?.op),
            getMetricUnit(document),
            errorBudgetPolicy(document),
            getSliName(document),
            getJourneyId(document),
            orgId(),
            getSLOsHandler(),
        ])

    const isSloExist =
        slos &&
        slos.find(
            (item) =>
                item?.name === document?.metadata?.name &&
                item?.status === sloStatus
        )

    const sloReq = {
        orgId: inputResult && inputResult?.orgId ? inputResult?.orgId : oId,
        model: {
            userId: inputResult?.sli?.userId ? inputResult?.sli?.userId : uId,
            name: getSloName(document),
            status: sloStatus,
            comparisonOperator: operator,
            metricUnit: mUnit,
            errorBudgetPolicyId: ebpId,
            objectivePercentage: getSloObjectives(document),
            sliId: sId,
            userJourneyId: uJourneyId,
        },
    }

    if (isSloExist) {
        logger.warn(
            `SLO == ${document?.metadata?.name} == already exist. Updating ...`
        )
        return await updateSLOHandler({ ...sloReq, id: isSloExist?.id }).then(
            (result) => ({
                isUpdated: true,
                data: result,
            })
        )
    } else {
        return await createSLOHandler(sloReq).then((result) => ({
            isUpdated: false,
            data: result,
        }))
    }
}

const sloProcessor = async (document, inputResult) => {
    let response
    const serviceSteps = new Listr([
        {
            title: 'Creating Slo',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting User Id...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting SLO name...',
                            task: () => getSloName(document),
                        },
                        {
                            title: 'Getting SLO status...',
                            task: () =>
                                getSloStatus(document).catch((err) => {
                                    throw new Error(err)
                                }),
                        },
                        {
                            title: 'Getting SLO target percentage...',
                            task: () => getSloObjectives(document),
                        },
                        {
                            title: 'Getting Comparison Operator...',
                            task: () =>
                                getComparisonOp(document?.spec?.op).catch(
                                    (err) => {
                                        throw new Error(err)
                                    }
                                ),
                        },
                        {
                            title: 'Getting SLI Id...',
                            task: async () => {
                                await getSliName(document).catch((err) => {
                                    throw new Error(err)
                                })
                            },
                        },
                        {
                            title: 'Creating SLO...',
                            task: async () =>
                                await createSlo(document, inputResult)
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
        await serviceSteps.run()
        logger.infoSuccess(
            `SUCCESSFULLY ${
                response?.isUpdated ? 'UPDATED' : 'CREATED'
            } SERVICE LEVEL OBJECTIVE: ${JSON.stringify(response?.data?.name)}`
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

module.exports = sloProcessor
