const Listr = require('listr')
const logger = require('../../logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getAllSliTypes = require('../../../../handlers/getSliTypes')
const getSliDataSources = require('../../../../handlers/getSliDataSources')
const getUserId = require('../../../../handlers/shared/getUserId')
const getServices = require('../../../../handlers/getServices')
const createSliHandler = require('../../../../handlers/slis/createSliHandler')
const getAllSLIs = require('../../../../handlers/slis/getAllSLIsHandler')
const updateSliHandler = require('../../../../handlers/slis/updateSliHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const getSliName = (document) => {
    if (document && document?.metadata && document?.metadata?.name) {
        return document && document?.metadata && document?.metadata?.name
    } else {
        const errorMessage = `Unable to get SLI Name. Please provide Sli name in your .YAML`
        throw errorMessage
    }
}

const getSliDescription = (document) => {
    if (document && document?.spec && document?.spec?.description) {
        return document && document?.spec && document?.spec?.description
    } else {
        const errorMessage = `Unable to get sli description`
        throw errorMessage
    }
}

const sliTypeId = async (document) => {
    const result = await getAllSliTypes()

    return result.find(
        (item) =>
            item?.name.toLowerCase() === document?.spec?.sliType?.toLowerCase()
    )?.id
}

const dataSourceId = async (document) => {
    const result = await getSliDataSources()
    if (
        document?.spec?.sliType &&
        document?.spec?.sliType.toLowerCase() === 'availability'
    ) {
        return result.find(
            (item) =>
                item?.vendorId.toLowerCase() ===
                (document?.spec?.ratioMetric?.good?.source.toLowerCase() ||
                    document?.spec?.ratioMetric?.total?.source.toLowerCase())
        )?.id
    }

    if (
        document?.spec?.sliType &&
        document?.spec?.sliType.toLowerCase() !== 'availability'
    ) {
        return result.find(
            (item) =>
                item?.vendorId.toLowerCase() ===
                document?.spec?.thresholdMetric?.source.toLowerCase()
        )?.id
    }
}

const serviceId = async (document) => {
    const result = await getServices()

    const matchingId =
        result &&
        result.find(
            (item) =>
                item?.name &&
                item?.name?.toLowerCase() ===
                    document?.metadata?.service?.toLowerCase()
        )?.id

    if (matchingId) {
        return matchingId
    }
}

const userId = async (document) => {
    const result = await getUserId(
        document && document?.spec && document?.spec?.owner
    )
    return result
}

const createSli = async (document, inputResult) => {
    const documentType = document?.spec?.sliType.toLowerCase()
    const createSliReq = {
        orgId:
            inputResult && inputResult?.orgId
                ? inputResult?.orgId
                : await orgId(),
        model: {
            name: getSliName(document),
            description: getSliDescription(document),
            dataSourceId: await dataSourceId(document),
            sliTypeId: await sliTypeId(document),
            serviceId: await serviceId(document),
            metricPath:
                documentType && documentType === 'availability'
                    ? JSON.stringify({
                          availability: {
                              good: document?.spec?.ratioMetric?.good?.query,
                              valid: document?.spec?.ratioMetric?.total?.query,
                          },
                      })
                    : JSON.stringify({
                          [documentType]:
                              document?.spec?.thresholdMetric?.query,
                      }),
            userId:
                inputResult && inputResult?.createdByUserId
                    ? inputResult?.createdByUserId
                    : await userId(document),
        },
    }

    const slis = await getAllSLIs()
    const matchingSliId =
        slis &&
        slis.find(
            (item) =>
                item?.name &&
                item?.name?.toLowerCase() ===
                    document?.metadata?.name?.toLowerCase()
        )?.id

    if (matchingSliId) {
        return updateSliHandler({ ...createSliReq, id: matchingSliId })
    }

    return createSliHandler(createSliReq)
}

const sliTypeProcessor = async (document, inputResult) => {
    let response
    const serviceSteps = new Listr([
        {
            title: 'Creating Sli',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting Sli name',
                            task: () => getSliName(document),
                        },
                        {
                            title: 'Getting Sli description',
                            task: () => getSliDescription(document),
                        },
                        {
                            title: 'Getting Sli Data Source',
                            task: () => {
                                getSliDataSources(document).catch((error) => {
                                    throw new Error(error)
                                })
                            },
                        },
                        {
                            title: 'Getting Sli Type',
                            task: () => {
                                sliTypeId(document).catch((error) => {
                                    throw new Error(error)
                                })
                            },
                        },
                        {
                            title: 'Creating Sli...',
                            task: async () =>
                                await createSli(document, inputResult)
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

module.exports = sliTypeProcessor
