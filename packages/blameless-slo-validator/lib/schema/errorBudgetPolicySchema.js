const Joi = require('joi')

const errorBudgetPolicySchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('ErrorBudgetPolicy').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string(),
        })
        .required(),
    spec: Joi.object()
        .keys({
            description: Joi.string(),
            alertPolicies: Joi.array().items(Joi.string()),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-userJourney'),
})

module.exports = errorBudgetPolicySchema
