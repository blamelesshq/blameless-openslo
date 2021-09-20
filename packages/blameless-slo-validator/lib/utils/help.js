const logger = require('./logger')

const help = () => {
    logger.help(`
    Description:
      Blameless SLO validate is a utility used to check the structure of
      a yaml file against a predefined Joi schema. The schema is expected
      to be a json format.
    Usage: blameless validate - [options]
    Example: blameless validate  -f path/slo.yaml
    Options:
      -f, --filePath <filePath> : path to the target file for validating
    `)
}

module.exports = help
