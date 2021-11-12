const Joi = require('joi')

const sloSchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('SLO').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string(),
            userJourney: Joi.string().required(),
        })
        .required(),
    spec: Joi.object()
        .keys({
            description: Joi.string(),
            owner: Joi.string().required(),
            sloStatus: Joi.string()
                .valid('development', 'testing', 'active')
                .required(),
            sliName: Joi.string().required(),
            target: Joi.number().required().min(1).less(100),
            op: Joi.string().valid('lte', 'gte', 'lt', 'gt').required(),
            valueMetric: Joi.string().valid('ms', 's').required(),
            value: Joi.number().greater(0).required(),
            errorBudgetPolicyName: Joi.string().optional(),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-slo'),
})

module.exports = sloSchema
