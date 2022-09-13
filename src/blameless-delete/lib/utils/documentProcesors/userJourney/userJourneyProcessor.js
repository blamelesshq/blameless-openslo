const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getUserJourneysHandler = require('../../../../handlers/userJourney/getUserJourneysHandler')
const deleteUserJourneyHandler = require('../../../../handlers/userJourney/deleteUserJourneyHandler')
const sloByUserJourneyIdHandler = require('../../../../handlers/userJourney/getSloByUserJourneyHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const userJourneyId = async (document) => {
    const [oId] = await Promise.all([orgId()])

    const [userJourneys] = await Promise.all([
        getUserJourneysHandler({ orgId: oId }),
    ])

    const result =
        userJourneys &&
        userJourneys.find(
            (uj) =>
                uj?.name?.toLowerCase() ===
                document?.metadata?.name?.toLowerCase()
        )?.id

    if (!result) {
        throw `Unable to find User Journey ${document?.metadata?.name}. Please make sure that it exist!`
    }

    return result
}

const slosByUserJourneyId = async (document) => {
    const [oId, ujId] = await Promise.all([orgId(), userJourneyId(document)])

    const slosByUserJourneyIdReq = {
        orgId: oId,
        userJourneyId: ujId,
    }

    const result = await sloByUserJourneyIdHandler(slosByUserJourneyIdReq)

    return result
}

const deleteUserJourney = async (document) => {
    const [oId, ujId, slos] = await Promise.all([
        orgId(),
        userJourneyId(document),
        slosByUserJourneyId(document),
    ])

    const deleteUserJourneyReq = {
        orgId: oId,
        id: ujId,
    }

    if (slos && slos.length > 0) {
        throw `Unable to delete User Journey ${document?.metadata?.name} due to associated SLOs. Please delete SLOs first.`
    }

    const result = await deleteUserJourneyHandler(deleteUserJourneyReq)
    return result
}

const userJourneyProcessor = async (document, inputResult) => {
    let response
    const userJourneySteps = new Listr([
        {
            title: 'Deleting User Journey ...',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId ...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting User Journey Id ...',
                            task: async () => {
                                await userJourneyId(document)
                            },
                        },
                        {
                            title: 'Getting SLOs associated with User Journey ...',
                            task: async () => {
                                await slosByUserJourneyId(document)
                            },
                        },
                        {
                            title: 'Deleting User Journey ...',
                            task: async () =>
                                await deleteUserJourney(document, inputResult)
                                    .then((result) => {
                                        response = result
                                    })
                                    .catch((error) => {
                                        throw error
                                    }),
                        },
                    ],
                    { concurrent: true, exitOnError: false }
                )
            },
        },
    ])
    try {
        await userJourneySteps.run()
        logger.infoSuccess(
            `SUCCESSFULLY DELETED USER JOURNEY: ${response?.name}`
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

module.exports = userJourneyProcessor
