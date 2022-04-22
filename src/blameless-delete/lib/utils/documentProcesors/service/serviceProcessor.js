const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getServicesHandlers = require('../../../../handlers/service/getServicesHandler')
const deleteServiceHandler = require('../../../../handlers/service/deleteServiceHandler')
const getSlisByServiceIdHandler = require('../../../../handlers/service/getSlisByServiceIdHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const getServiceId = async (document) => {
    const [oId] = await Promise.all([orgId()])

    const [services] = await Promise.all([getServicesHandlers({ orgId: oId })])

    return (
        services &&
        services.find(
            (service) =>
                service?.name?.toLowerCase() ===
                document?.metadata?.name?.toLowerCase()
        )?.id
    )
}

const slisByServiceId = async (document) => {
    const [oId, serviceId] = await Promise.all([
        orgId(),
        getServiceId(document),
    ])

    const req = {
        orgId: oId,
        serviceId: serviceId,
    }

    const result = await getSlisByServiceIdHandler(req)
    return result
}

const deleteService = async (document, inputResult) => {
    const [oId, serviceId, slis] = await Promise.all([
        orgId(),
        getServiceId(document),
        slisByServiceId(document)
    ])

    const deleteServiceReq = {
        orgId: oId,
        id: serviceId,
    }
    

    if (slis && slis.length > 0) {
        throw `Unable to delete service ${document?.metadata?.name} due to associated SLIs. Please delete SLIs first.`
    }

    const result = await deleteServiceHandler(deleteServiceReq)
    return result
}

const serviceProcessor = async (document, inputResult) => {
    let response
    const serviceSteps = new Listr([
        {
            title: 'Deleting Service ...',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId ...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting Service Id ...',
                            task: async () => {
                                await getServiceId(document)
                            },
                        },
                        {
                            title: 'Getting Slis associated with service ...',
                            task: async () => {
                                await slisByServiceId(document)
                            },
                        },
                        {
                            title: 'Deleting Service ...',
                            task: async () =>
                                await deleteService(document, inputResult)
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
            `SUCCESSFULLY DELETED SERVICE: ${JSON.stringify(response?.name)}`
        )
    } catch (err) {
        logger.infoError('ERRORS:', err?.errors?.toString().split(','))
    }
    return response ? response : false
}

module.exports = serviceProcessor
