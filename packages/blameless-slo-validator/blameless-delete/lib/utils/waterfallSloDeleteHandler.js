const userJourneyProcesor = require('./documentProcesors/userJourney/userJourneyProcessor')
const serviceProcessor = require('./documentProcesors/service/serviceProcessor')
const sliTypeProcessor = require('./documentProcesors/sli/sliTypeProcessor')
const sloProcessor = require('./documentProcesors/slo/sloProcessor')

const _flattenObj = (obj) => Object.values(obj).flat()

const waterfallSloDeleteHandler = async (documents) => {
    const docs = _flattenObj(documents)
    const userJourneyDocs =
        docs && docs.filter((d) => d?.kind === 'UserJourney')
    const servicesDocs = docs && docs.filter((d) => d?.kind === 'Service')
    const sliDocs = docs && docs.filter((d) => d?.kind === 'SLI')
    const sloDocs = docs && docs.filter((d) => d?.kind === 'SLO')

    for (const key in sloDocs) {
        if (Object.hasOwnProperty.call(documents?.SLO, key)) {
            const currentSLODoc = documents?.SLO[key]
            await sloProcessor(currentSLODoc)
        }
    }

    for (const key in userJourneyDocs) {
        if (Object.hasOwnProperty.call(documents?.UserJourney, key)) {
            const currentUserJourneyDoc = documents?.UserJourney[key]
            await userJourneyProcesor(currentUserJourneyDoc)
        }
    }

    for (const key in sliDocs) {
        if (Object.hasOwnProperty.call(documents?.SLI, key)) {
            const currentSLIDoc = documents?.SLI[key]
            await sliTypeProcessor(currentSLIDoc)
        }
    }

    for (const key in servicesDocs) {
        if (Object.hasOwnProperty.call(documents?.Service, key)) {
            const currentServiceDoc = documents?.Service[key]
            await serviceProcessor(currentServiceDoc)
        }
    }
}

module.exports = waterfallSloDeleteHandler
