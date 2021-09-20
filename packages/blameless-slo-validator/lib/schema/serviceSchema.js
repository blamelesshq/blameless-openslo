const Joi = require('joi')

const serviceSchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('Service').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string(),
        })
        .required(),
    spec: Joi.object()
        .keys({
            description: Joi.string().required(),
            notes: Joi.string().optional(),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-serviceSchema'),
})

module.exports = serviceSchema
