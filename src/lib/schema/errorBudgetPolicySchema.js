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
            notificationPolicies: Joi.array().items(
                Joi.object().keys({
                    thresholdType: Joi.string()
                        .valid('percent_depleted', 'days_left')
                        .required(),
                    threshold: Joi.when('thresholdType', {
                        is: 'percent_depleted',
                        then: Joi.number().integer().min(1).max(99).required(),
                        otherwise: Joi.number()
                            .integer()
                            .min(0)
                            .max(27)
                            .required(),
                    }),
                    notifications: Joi.object().keys({
                        email: Joi.array()
                            .items(
                                Joi.string().email({
                                    minDomainSegments: 2,
                                    tlds: { allow: ['com', 'net'] },
                                })
                            )
                            .optional(),
                        slack: Joi.object()
                            .keys({
                                channels: Joi.array()
                                    .items(Joi.string())
                                    .optional(),
                                users: Joi.array()
                                    .items(Joi.string())
                                    .optional(),
                            })
                            .optional(),
                        teams: Joi.object()
                            .keys({
                                teams: Joi.array()
                                    .items(Joi.string())
                                    .optional(),
                                channels: Joi.array()
                                    .items(Joi.string())
                                    .optional(),
                                users: Joi.array()
                                    .items(Joi.string())
                                    .optional(),
                            })
                            .optional(),
                        incident: Joi.object()
                            .keys({
                                severity: Joi.string().valid(
                                    'SEV0',
                                    'SEV1',
                                    'SEV2',
                                    'SEV3'
                                ),
                                type: Joi.string().optional(),
                            })
                            .optional(),
                    }),
                    // .xor('emails', 'slack', 'teams', 'incident'),
                })
            ),
        })
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-userJourney'),
})

module.exports = errorBudgetPolicySchema
