const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const createServiceHandlers = require('../../../../handlers/service/createServiceHandler')
const getOrgId = require('../../../../handlers/shared/getOrgId')
const getUserId = require('../../../../handlers/shared/getUserId')
const getServicesHandlers = require('../../../../handlers/service/getServicesHandler')
const updateServiceHandlers = require('../../../../handlers/service/updateServiceHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const userId = async (document) => {
    const result = await getUserId(document?.spec?.owner)
    return result
}

const getServiceName = (document) => {
    return document && document?.metadata?.name
}

const getServiceDescription = (document) => {
    return document && document?.spec?.description
}

const getServiceNotes = (document) => {
    return document && document?.spec?.notes
}

const createService = async (document, inputResult) => {
    const [uId, oId] = await Promise.all([userId(document), orgId()])

    const [services] = await Promise.all([
        getServicesHandlers({
            orgId: inputResult && inputResult?.orgId ? inputResult?.orgId : oId,
        }),
    ])

    const serviceRequest = {
        orgId: inputResult && inputResult?.orgId ? inputResult?.orgId : oId,
        model: {
            name: getServiceName(document),
            description: getServiceDescription(document),
            notes: getServiceNotes(document),
            createdByUserId:
                inputResult && inputResult?.createdByUserId
                    ? inputResult?.createdByUserId
                    : uId,
        },
    }

    const serviceId =
        services &&
        services.find((service) => service.name === document?.metadata?.name)
            ?.id

    if (serviceId) {
        return await updateServiceHandlers({
            ...serviceRequest,
            id: serviceId,
        }).then((result) => ({
            isUpdated: true,
            data: result,
        }))
    } else {
        return await createServiceHandlers(serviceRequest).then((result) => ({
            isUpdated: false,
            data: result,
        }))
    }
}

const serviceProcessor = async (document, inputResult) => {
    let response
    const serviceSteps = new Listr([
        {
            title: 'Managing Service ...',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId ...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting userId ...',
                            task: async () =>
                                await userId(document).catch((error) => {
                                    throw new Error(error)
                                }),
                        },
                        {
                            title: 'Getting Service Name ...',
                            task: () => getServiceName(document),
                        },
                        {
                            title: 'Getting Service Description ...',
                            task: () => {
                                getServiceDescription(document)
                            },
                        },
                        {
                            title: 'Getting Service Notes ...',
                            task: () => {
                                getServiceNotes(document)
                            },
                        },
                        {
                            title: 'Managing Service ...',
                            task: async () =>
                                await createService(document, inputResult)
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
            `SUCCESSFULLY ${
                response?.isUpdated ? 'UPDATED' : 'CREATED'
            } SERVICE: ${JSON.stringify(response?.data?.name)}`
        )
    } catch (err) {
        logger.infoError('ERRORS:', err?.errors?.toString().split(','))
    }
    return response ? response : false
}

module.exports = serviceProcessor
