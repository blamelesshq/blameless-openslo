const Joi = require('joi')

const alertConditionSchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('AlertCondition').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string().optional(),
        })
        .required(),
    spec: Joi.object()
        .keys({
            description: Joi.string(),
            condition: Joi.object().keys({
                kind: Joi.string()
                    .valid('percent_depleted', 'days_left')
                    .required(),
                threshold: Joi.when('kind', {
                    is: 'percent_depleted',
                    then: Joi.number().precision(5).min(0).max(1).required(),
                    otherwise: Joi.number().integer().min(0).max(27).required(),
                }),
            }),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-userJourney'),
})

module.exports = alertConditionSchema
