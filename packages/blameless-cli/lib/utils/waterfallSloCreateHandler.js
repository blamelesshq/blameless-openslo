const logger = require('../utils/logger')
const userJourneyProcesor = require('../utils/documentProcesors/userJourney/userJourneyProcessor')
const serviceProcessor = require('../utils/documentProcesors/service/serviceProcessor')
const sliTypeProcessor = require('../utils/documentProcesors/sli/sliTypeProcessor')
const sloProcessor = require('../utils/documentProcesors/slo/sloProcessor')

const waterfallSloCreateHandler = async (documents) => {
    userJourneyProcesor(...documents?.UserJourney)
        .then((result) => serviceProcessor(...documents.Service, result))
        .then((result) => sliTypeProcessor(...documents.SLI, result))
        .then((result) => sloProcessor(...documents.SLO, result))
}

module.exports = waterfallSloCreateHandler
