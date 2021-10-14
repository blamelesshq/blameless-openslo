const Listr = require('listr')
const logger = require('../../logger')

const createUserJourneyHandler = require('../../../../handlers/createUserJourneyHandler')
const getOrgId = require('../../../../handlers/shared/getOrgId')
const getUserId = require('../../../../handlers/shared/getUserId')
const getUserJourneysHandler = require('../../../../handlers/userJourney/getUserJourneysHandler')
const updateUserJourneyHandler = require('../../../../handlers/userJourney/updateUserJourneyHandler')

let isUpdateOperation = false

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const userId = async (document) => {
    const result = await getUserId(document?.spec?.owner)
    return result
}

const getUserJourneyName = (document) => {
    return document && document?.metadata?.name
}

const getUserJourneyDesc = (document) => {
    return document && document?.spec?.description
}

const createUserJourneyRecord = async (document) => {
    const userJourneys = await getUserJourneysHandler({
        orgId: await orgId(),
    })
    const isUserJourneyExist =
        userJourneys &&
        userJourneys.find((item) => item.name === document?.metadata?.name)?.id
    if (isUserJourneyExist) {
        isUpdateOperation = true
        const updateUserJourneyRequest = {
            orgId: await orgId(),
            id: isUserJourneyExist,
            model: {
                name: getUserJourneyName(document),
                description: getUserJourneyDesc(document),
                userId: await userId(document),
            },
        }

        return updateUserJourneyHandler(updateUserJourneyRequest)
    }
    const createUserJourneyRequest = {
        orgId: await orgId(),
        model: {
            name: getUserJourneyName(document),
            description: getUserJourneyDesc(document),
            userId: await userId(document),
        },
    }

    return createUserJourneyHandler(createUserJourneyRequest)
}

const userJourneyProcessor = async (document) => {
    let response
    const userJourneySteps = new Listr([
        {
            title: `${
                isUpdateOperation
                    ? 'Updating User Journey'
                    : 'Creating User Journey'
            }`,
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting userId',
                            task: () =>
                                userId(document).catch((error) => {
                                    throw new Error(error)
                                }),
                        },
                        {
                            title: 'Getting UserJourney Name',
                            task: () => getUserJourneyName(document),
                        },
                        {
                            title: 'Getting UserJourney Description',
                            task: () => {
                                getUserJourneyDesc(document)
                            },
                        },
                        {
                            title: `${
                                isUpdateOperation
                                    ? 'Updating User Journey'
                                    : 'Creating User Journey'
                            }`,
                            task: async () =>
                                await createUserJourneyRecord(document)
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
        await userJourneySteps.run()
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

module.exports = userJourneyProcessor
