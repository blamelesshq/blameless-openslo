const Joi = require('joi')

const sliSchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('SLI').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string(),
            service: Joi.string().required(),
        })
        .required(),
    spec: Joi.object()
        .keys({
            description: Joi.string(),
            sliType: Joi.string()
                .valid('availability', 'latency', 'throughput', 'saturation')
                .required(),
            ratioMetric: Joi.alternatives().conditional('sliType', {
                is: 'availability',
                then: Joi.object().keys({
                    good: Joi.object().keys({
                        source: Joi.string().required(),
                        queryType: Joi.string().required(),
                        query: Joi.string().required(),
                        metadata: Joi.optional(),
                    }),
                    total: Joi.object().keys({
                        source: Joi.string().required(),
                        queryType: Joi.string().required(),
                        query: Joi.string().required(),
                        metadata: Joi.optional(),
                    }),
                }),
            }),
            thresholdMetric: Joi.alternatives().conditional('sliType', {
                not: 'availability',
                then: Joi.object().keys({
                    source: Joi.string().required(),
                    queryType: Joi.string().required(),
                    query: Joi.string().required(),
                    metadata: Joi.optional(),
                }),
            }),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-sli'),
})

module.exports = sliSchema
