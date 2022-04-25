const serviceProcesor = require('./documentProcesors/service/serviceProcessor')
const sliTypeProcesor = require('./documentProcesors/sli/sliTypeProcessor')
const sloProcesor = require('./documentProcesors/slo/sloProcessor')
const userJourneyProcesor = require('./documentProcesors/userJourney/userJourneyProcessor')
const alertConditionTypeProcessor = require('./documentProcesors/alertCondition/alertConditionTypeProcessor')
const errorBudgetPolicyTypeProcessor = require('./documentProcesors/errorBudgetPolicy/errorBudgetPolicyTypeProcessor')

const documentProcessorByType = (type, document) => {
    const docs = {
        sli: () => sliTypeProcesor(document),
        userjourney: () => userJourneyProcesor(document),
        service: () => serviceProcesor(document),
        slo: () => sloProcesor(document),
        alertcondition: () => alertConditionTypeProcessor(document),
        errorbudgetpolicy: () => errorBudgetPolicyTypeProcessor(document),
    }
    return docs[type]()
}

module.exports = documentProcessorByType
