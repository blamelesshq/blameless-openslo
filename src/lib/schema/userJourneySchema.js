const Joi = require('joi')

const userJourneySchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('UserJourney').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string(),
        })
        .required(),
    spec: Joi.object()
        .keys({
            description: Joi.string(),
            owner: Joi.string().required(),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-userJourney'),
})

module.exports = userJourneySchema
