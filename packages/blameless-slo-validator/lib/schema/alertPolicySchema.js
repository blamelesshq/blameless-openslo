const Joi = require('joi')

const alertConditionSchema = Joi.object().keys({
    condition: Joi.object().keys({
        kind: Joi.string().valid('percent_depleted', 'days_left').required(),
        threshold: Joi.when('kind', {
            is: 'percent_depleted',
            then: Joi.number().precision(5).min(0).max(1).required(),
            otherwise: Joi.number().integer().min(0).max(27).required(),
        }),
    }),
})

const notificationTargetsSchema = Joi.object().keys({
    target: Joi.string().required(),
    description: Joi.string().optional(),
    parameters: Joi.array()
        .items(
            Joi.object().keys({
                name: Joi.string().required(),
                description: Joi.string().optional(),
                type: Joi.string().required(),
                value: Joi.string().optional(),
                defaultValue: Joi.string().optional(),
            })
        )
        .optional(),
})

const alertPolicySchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('AlertPolicy').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string().optional(),
        })
        .required(),
    spec: Joi.object()
        .keys({
            description: Joi.string(),
            conditions: Joi.array().items(alertConditionSchema),
            notificationTargets: Joi.array().items(notificationTargetsSchema),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-userJourney'),
})

module.exports = alertPolicySchema
