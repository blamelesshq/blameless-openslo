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
            owner: Joi.string().required(),
            sliType: Joi.string()
                .valid('availability', 'latency', 'throughput', 'saturation')
                .required(),
            metricSource: Joi.object().keys({
                enablePrometheus: Joi.boolean().required(),
                mode: Joi.string().valid('direct', 'gcp', 'lambda').required(),
                tenantKey: Joi.string().required(),
                sourceName: Joi.string().required(),
                token: Joi.string().required(),
            }),
            ratioMetric: Joi.object()
                .keys({
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
                })
                .when('sliType', { is: 'availability', then: Joi.required() }),
            thresholdMetric: Joi.object()
                .keys({
                    source: Joi.string().required(),
                    queryType: Joi.string().required(),
                    query: Joi.string().required(),
                    metadata: Joi.optional(),
                })
                .when('sliType', { not: 'availability', then: Joi.required() }),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-sli'),
})

module.exports = sliSchema
