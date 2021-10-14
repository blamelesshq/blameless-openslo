const Listr = require('listr')
const logger = require('../../logger')

const createUserJourneyHandler = require('../../../../handlers/createUserJourneyHandler')
const getOrgId = require('../../../../handlers/shared/getOrgId')
const getUserId = require('../../../../handlers/shared/getUserId')
const getAllSLIs = require('../../../../handlers/slis/getAllSLIsHandler')
const getUserJourneysHandler = require('../../../../handlers/userJourney/getUserJourneysHandler')
const createSLOHandler = require('../../../../handlers/slo/createSLOHandler')
const sloStatusesHandler = require('../../../../handlers/slo/getSLOStatusesHandler')

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

    if (matchingSloId) {
        return matchingSloId
    }
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
    if (matchingSliId) {
        return matchingSliId
    }
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
            objectivePercentage: getSloObjectives(document),
            sliId: await getSliName(document),
            userJourneyId: await getJourneyId(document),
        },
    }

    return createSLOHandler(createSloRequest)
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
                            title: 'Getting user Id',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting Slo name',
                            task: () => getSloName(document),
                        },
                        {
                            title: 'Getting Slo status',
                            task: () => getSloStatus(document),
                        },
                        {
                            title: 'Getting Slo target percentage',
                            task: () => getSloObjectives(document),
                        },
                        {
                            title: 'Getting Sli id',
                            task: () => {
                                getSliName(document).catch((error) => {
                                    throw new Error(error)
                                })
                            },
                        },
                        {
                            title: 'Creating Slo...',
                            task: async () =>
                                await createSlo(document, inputResult)
                                    .then((result) => {
                                        response = result
                                    })
                                    .catch((error) => {
                                        throw new Error(error)
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
        logger.infoError('ERRORS:', err?.errors?.toString().split(','))
    }
    return response ? response : false
}

module.exports = sloProcessor
