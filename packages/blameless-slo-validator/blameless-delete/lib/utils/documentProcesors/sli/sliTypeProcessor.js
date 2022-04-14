const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const getAllSLIs = require('../../../../handlers/slis/getAllSLIsHandler')
const getSlosBySliIdHandler = require('../../../../handlers/slis/getSlosBySliIdHandler')
const deleteSliHandler = require('../../../../handlers/slis/deleteSliHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const sliId = async (document) => {
    const [slis] = await Promise.all([getAllSLIs()])

    const result =
        slis &&
        slis.find(
            (sli) =>
                sli?.name?.toLowerCase() ===
                document?.metadata?.name?.toLowerCase()
        )?.id

    if (!result) {
        throw `SLI was not found. Please make sure that SLI exist!`
    }

    return result
}

const slosBySliId = async (document) => {
    const [id, oId] = await Promise.all([sliId(document), orgId()])

    const req = {
        orgId: oId,
        sliId: id,
    }

    const result = await getSlosBySliIdHandler(req)

    return result
}

const deleteSLi = async (document, inputResult) => {
    const [oId, sId, slos] = await Promise.all([
        orgId(),
        sliId(document),
        slosBySliId(document),
    ])

    const deleteSliReq = {
        orgId: oId,
        id: sId,
    }

    if (slos && slos?.length > 0) {
        throw `There are SLOs associated to this SLI ${document?.metadata?.name}. You must delete the SLOs before deleting this SLI`
    }

    const result = await deleteSliHandler(deleteSliReq)
    return result
}

const sliTypeProcessor = async (document, inputResult) => {
    let response
    const serviceSteps = new Listr([
        {
            title: 'Deleting Sli ...',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting orgId ...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting Sli Id ...',
                            task: async () => await sliId(document),
                        },
                        {
                            title: 'Getting SLOs associated with SLI ...',
                            task: async () => await slosBySliId(document),
                        },
                        {
                            title: 'Deleting Sli ...',
                            task: async () =>
                                await deleteSLi(document, inputResult)
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
        await serviceSteps.run()
        logger.infoSuccess(
            `SUCCESSFULLY DELETED SERVICE LEVEL INDICATOR: ${JSON.stringify(
                response?.data?.sli?.name
            )}`
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

module.exports = sliTypeProcessor
