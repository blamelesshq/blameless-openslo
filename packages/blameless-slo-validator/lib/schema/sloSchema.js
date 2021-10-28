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
            target: Joi.number().required().min(0).less(1),
            op: Joi.when(Joi.ref('/sliType'), {
                is: Joi.exist().equal('thresholdMetric'),
                then: Joi.string().valid('lte', 'gte', 'lt', 'gt').required(),
            }),
            value: Joi.when(Joi.ref('/sliType'), {
                is: Joi.exist().equal('thresholdMetric'),
                then: Joi.number().greater(0).required(),
            }),
            valueMetric: Joi.when(Joi.ref('/sliType'), {
                is: Joi.exist().equal('thresholdMetric'),
                then: Joi.string().valid('ms', 's').required(),
            }),
            errorBudgetPolicyName: Joi.string().optional(),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-slo'),
})

module.exports = sloSchema
