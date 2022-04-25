const listOfMinimalRequiredDocuments = ['Service', 'SLO', 'SLI', 'UserJourney']
const allowedTypes = ['github', 'local']
const retryStrategyMechanisamDefaultOptions = {
    maxRetryAttempts: 3,
    scalingDuration: 1000,
    excludedStatusCodes: [401],
}

module.exports = {
    listOfMinimalRequiredDocuments,
    allowedTypes,
    retryStrategyMechanisamDefaultOptions,
}
