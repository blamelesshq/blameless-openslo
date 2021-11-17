const userJourneyProcesor = require('../utils/documentProcesors/userJourney/userJourneyProcessor')
const serviceProcessor = require('../utils/documentProcesors/service/serviceProcessor')
const sliTypeProcessor = require('../utils/documentProcesors/sli/sliTypeProcessor')
const sloProcessor = require('../utils/documentProcesors/slo/sloProcessor')
const _ = require('lodash')

const waterfallSloCreateHandler = async (documents) => {
    const docs = _.flatten(Object.values(documents))
    const userJourneyDocs =
        docs && docs.filter((d) => d?.kind === 'UserJourney')
    const servicesDocs = docs && docs.filter((d) => d?.kind === 'Service')
    const sliDocs = docs && docs.filter((d) => d?.kind === 'SLI')
    const sloDocs = docs && docs.filter((d) => d?.kind === 'SLO')

    for (const key in userJourneyDocs) {
        if (Object.hasOwnProperty.call(documents?.UserJourney, key)) {
            const currentUserJourneyDoc = documents?.UserJourney[key]
            await userJourneyProcesor(currentUserJourneyDoc)
        }
    }

    for (const key in servicesDocs) {
        if (Object.hasOwnProperty.call(documents?.Service, key)) {
            const currentServiceDoc = documents?.Service[key]
            await serviceProcessor(currentServiceDoc)
        }
    }

    for (const key in sliDocs) {
        if (Object.hasOwnProperty.call(documents?.SLI, key)) {
            const currentSLIDoc = documents?.SLI[key]
            await sliTypeProcessor(currentSLIDoc)
        }
    }

    for (const key in sloDocs) {
        if (Object.hasOwnProperty.call(documents?.SLO, key)) {
            const currentSLODoc = documents?.SLO[key]
            await sloProcessor(currentSLODoc)
        }
    }
}

module.exports = waterfallSloCreateHandler
