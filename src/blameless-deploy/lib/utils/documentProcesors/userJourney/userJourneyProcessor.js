const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const createUserJourneyHandler = require('../../../../handlers/userJourney/createUserJourneyHandler')
const getOrgId = require('../../../../handlers/shared/getOrgId')
const getUserId = require('../../../../handlers/shared/getUserId')
const getUserJourneysHandler = require('../../../../handlers/userJourney/getUserJourneysHandler')
const updateUserJourneyHandler = require('../../../../handlers/userJourney/updateUserJourneyHandler')

let isUpdateOp = false

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
    const [oId, uId] = await Promise.all([orgId(), userId(document)])

    const [userJourneys] = await Promise.all([
        getUserJourneysHandler({ orgId: oId }),
    ])

    const userJourneyRequest = {
        orgId: oId,
        model: {
            name: getUserJourneyName(document),
            description: getUserJourneyDesc(document),
            userId: uId,
        },
    }

    const userJourneyId =
        userJourneys &&
        userJourneys.find((item) => item.name === document?.metadata?.name)?.id

    if (userJourneyId) {
        isUpdateOp = true
        return await updateUserJourneyHandler({
            ...userJourneyRequest,
            id: userJourneyId,
        }).then((result) => ({
            isUpdated: true,
            data: result,
        }))
    } else {
        return await createUserJourneyHandler(userJourneyRequest).then(
            (result) => ({
                isUpdated: false,
                data: result,
            })
        )
    }
}

const userJourneyProcessor = async (document) => {
    let response
    const userJourneySteps = new Listr([
        {
            title: `${
                isUpdateOp
                    ? 'Updating User Journey ...'
                    : 'Creating User Journey ...'
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
                                isUpdateOp
                                    ? 'Updating User Journey ...'
                                    : 'Creating User Journey ...'
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
            `SUCCESSFULLY ${
                response?.isUpdated ? 'UPDATED' : 'CREATED'
            } USER JOURNEY: ${JSON.stringify(
                response?.data?.userJourney?.name
            )}`
        )
    } catch (err) {
        logger.infoError('ERRORS:', err?.errors?.toString().split(','))
    }
    return response ? response : false
}

module.exports = userJourneyProcessor
