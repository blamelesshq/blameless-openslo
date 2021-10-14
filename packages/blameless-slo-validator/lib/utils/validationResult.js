const Joi = require('joi')

const validationResult = (data, validationSchema) => {
    const isValidSchema = Joi.isSchema(validationSchema)
    if (isValidSchema) {
        return validationSchema.validate(data, {
            abortEarly: false,
        })
    }
}

module.exports = validationResult
