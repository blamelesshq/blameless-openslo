const Joi = require('joi')

const alertNotificationSchema = Joi.object().keys({
    apiVersion: Joi.string()
        .valid('blameless/v1alpha', 'openslo/v1alpha')
        .required(),
    kind: Joi.string().valid('AlertNotificationTarget').required(),
    metadata: Joi.object()
        .keys({
            name: Joi.string().required(),
            displayName: Joi.string().optional(),
        })
        .required(),
    spec: Joi.object()
        .keys({
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
        .required()
        .options({
            allowUnknown: false,
        })
        .id('blameless-alertNotificationSchema'),
})

module.exports = alertNotificationSchema
