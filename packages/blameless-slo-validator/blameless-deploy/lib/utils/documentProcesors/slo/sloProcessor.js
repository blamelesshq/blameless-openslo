const Listr = require('listr')
const logger = require('../../logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getUserId = require('../../../../handlers/shared/getUserId')
const getAllSLIs = require('../../../../handlers/slis/getAllSLIsHandler')
const getUserJourneysHandler = require('../../../../handlers/userJourney/getUserJourneysHandler')
const createSLOHandler = require('../../../../handlers/slo/createSLOHandler')
const sloStatusesHandler = require('../../../../handlers/slo/getSLOStatusesHandler')
const getSloComparisonOperatorsHandlers = require('../../../../handlers/slo/getSloComparisonOperatorsHandlers')
const getSloMetricUnitTypesHandler = require('../../../../handlers/slo/getSloMetricUnitTypesHandler')
const getErrorBudgetPolicyHandler = require('../../../../handlers/errorBudgetPolicy/getErrorBudgetPoliciesHandler')

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
    const slis = await getAllSLIs()
    const matchingSliId =
        slis &&
        slis.find(
            (item) =>
                item?.name &&
                item?.name?.toLowerCase() ===
                    document?.spec?.sliName?.toLowerCase()
        )?.id

    if (!matchingSliId) {
        throw new Error(
            `SLI with name ${document?.spec?.sliName} does not exist. Please make sure that SLI is already created before try to create SLO.`
        )
    }

    return matchingSliId
}

const getJourneyId = async (document) => {
    const userJourneys = await getUserJourneysHandler({
        orgId: await getOrgId(),
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
    const createSloRequest = {
        orgId:
            inputResult && inputResult?.orgId
                ? inputResult?.orgId
                : await orgId(),
        model: {
            userId: inputResult?.sli?.userId
                ? inputResult?.sli?.userId
                : await userId(document),
            name: await getSloName(document),
            status: await getSloStatus(document),
            comparisonOperator: await getComparisonOp(document?.spec?.op),
            metricUnit: await getMetricUnit(document),
            errorBudgetPolicyId: await errorBudgetPolicy(document),
            objectivePercentage: getSloObjectives(document),
            sliId: await getSliName(document),
            userJourneyId: await getJourneyId(document),
        },
    }

    return await createSLOHandler(createSloRequest)
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

module.exports = sloProcessor
