const serviceProcesor = require('./documentProcesors/service/serviceProcessor')
const sliTypeProcesor = require('./documentProcesors/sli/sliTypeProcessor')
const sloProcesor = require('./documentProcesors/slo/sloProcessor')
const userJourneyProcesor = require('./documentProcesors/userJourney/userJourneyProcessor')

const documentProcessorByType = (type, document) => {
    const docs = {
        sli: () => sliTypeProcesor(document),
        userjourney: () => userJourneyProcesor(document),
        service: () => serviceProcesor(document),
        slo: () => sloProcesor(document),
    }
    return docs[type]()
}

module.exports = documentProcessorByType
