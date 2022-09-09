const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getAllSliTypes = require('../../../../handlers/slis/getSliTypes')
const getSliDataSources = require('../../../../handlers/slis/getSliDataSources')
const getUserId = require('../../../../handlers/shared/getUserId')
const getServices = require('../../../../handlers/service/getServicesHandler')
const createSliHandler = require('../../../../handlers/slis/createSliHandler')
const GetSliByName = require('../../../../handlers/slis/GetSliByNameHandler')
const updateSliHandler = require('../../../../handlers/slis/updateSliHandler')
const getGcpClusterSettingsHandler = require('../../../../handlers/slis/getGcpClusterSettingsHandler')

const throwError = (msg) => {
    throw msg
}

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
    if (!result) {
        throw new Error('Unable to retrieve SLI Types...')
    }

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

const gcpSettings = async (document) => {
    const settings = await getGcpClusterSettingsHandler()

    const gcpSetting = Object.entries(settings?.response?.gcp)

    if (gcpSetting && gcpSetting.length > 0) {
        const result = gcpSetting.find(
            (item) =>
                item[1].name &&
                item[1].name.toLowerCase() &&
                item[1].name.toLowerCase().trim() ===
                    document?.spec?.gcpSettingsName?.toLowerCase()?.trim()
        )
        if (result) {
            return result && result[0]
        } else {
            throw new Error(
                `Unable to get gcp settings. Please make sure that gcp settings "${document?.spec?.gcpSettingsName?.toLowerCase()}" already exist`
            )
        }
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

    return matchingId
        ? matchingId
        : throwError(
              `Unable to get serviceId. Please make sure that service "${document?.metadata?.service?.toLowerCase()}" already exist`
          )
}

const userId = async (document) => {
    const result = await getUserId(
        document && document?.spec && document?.spec?.owner
    )
    return result
}

const createSli = async (document, inputResult) => {
    const documentType = document?.spec?.sliType.toLowerCase()
    const sliName = document?.metadata?.name

    const [uId, sli, servId, sTypeId, sourceId, oId] = await Promise.all([
        userId(document),
        GetSliByName(sliName),
        serviceId(document),
        sliTypeId(document),
        dataSourceId(document),
        orgId(),
    ])

    const sliRequest = {
        orgId: inputResult && inputResult?.orgId ? inputResult?.orgId : oId,
        model: {
            name: getSliName(document),
            description: getSliDescription(document),
            dataSourceId: sourceId,
            sliTypeId: sTypeId,
            serviceId: servId,
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
                    : uId,
        },
    }

    if (sli?.id) {
        return await updateSliHandler({
            ...sliRequest,
            id: sli.id,
        }).then((result) => ({
            isUpdated: true,
            data: result,
        }))
    } else {
        return await createSliHandler(sliRequest).then((result) => ({
            isUpdated: false,
            data: result,
        }))
    }
}

const sliTypeProcessor = async (document, inputResult) => {
    // await gcpSettings(document)
    let response
    const serviceSteps = new Listr([
        {
            title: 'Creating Sli ...',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId ...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting Sli name ...',
                            task: () => getSliName(document),
                        },
                        {
                            title: 'Getting Sli description ...',
                            task: () => getSliDescription(document),
                        },
                        {
                            title: 'Getting Sli Data Source ...',
                            task: () => {
                                getSliDataSources(document).catch((error) => {
                                    throw new Error(error)
                                })
                            },
                        },
                        {
                            title: 'Getting Sli Type ...',
                            task: async () => {
                                await sliTypeId(document).catch((error) => {
                                    throw new Error(error)
                                })
                            },
                        },
                        {
                            title: 'Creating Sli ...',
                            task: async () =>
                                await createSli(document, inputResult)
                                    .then((result) => {
                                        response = {
                                            isUpdated: result.isUpdated,
                                            data: result?.data?.sli
                                        }
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
            } SERVICE LEVEL INDICATOR: ${JSON.stringify(response?.data?.name)}`
        )
    } catch (err) {
        logger.infoError('ERRORS:', err?.errors?.toString().split(','))
    }
    return response ? response : false
}

module.exports = sliTypeProcessor
