const Listr = require('listr')
const logger = require('../../../../../lib/utils/logger')

const getOrgId = require('../../../../handlers/shared/getOrgId')
const slosHandler = require('../../../../handlers/slo/getSlosHandler')
const deleteSloHandler = require('../../../../handlers/slo/deleteSloHandler')

const orgId = async () => {
    const result = await getOrgId()
    return result
}

const sloId = async (document) => {
    const [slos] = await Promise.all([slosHandler()])

    const result =
        slos &&
        slos.find(
            (slo) =>
                slo?.name?.toLowerCase() ===
                document?.metadata?.name?.toLowerCase()
        )?.id

    if (!result) {
        throw `Unable to find SLO. Please make sure that SLO exist!`
    }

    return result
}

const deleteSlo = async (document, inputResult) => {
    const [oId, sId] = await Promise.all([orgId(), sloId(document)])

    const deleteSloReq = {
        orgId: oId,
        id: sId
    }

    const result = await deleteSloHandler(deleteSloReq)
    return result
}

const sloProcessor = async (document, inputResult) => {
    let response
    const serviceSteps = new Listr([
        {
            title: 'Deleting Slo ...',
            task: async () => {
                return new Listr(
                    [
                        {
                            title: 'Getting Org Id...',
                            task: async () => await orgId(),
                        },
                        {
                            title: 'Getting SLO Id ...',
                            task: async () => await sloId(document),
                        },
                        {
                            title: 'Deleting SLO ...',
                            task: async () =>
                                await deleteSlo(document, inputResult)
                                    .then((result) => {
                                        response = result
                                    })
                                    .catch((err) => {
                                        throw err
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
            `SUCCESSFULLY DELETED SLO: ${JSON.stringify(
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
