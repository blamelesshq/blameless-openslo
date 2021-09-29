require('dotenv').config()

/**
 * @description Environment configuration
 */
const envConfig = {
    loginBase: process.env.BLAMELESS_OAUTH_BASE,
    clientId: process.env.BLAMELESS_OAUTH_CLIENT_ID,
    clientSecret: process.env.BLAMELESS_OAUTH_CLIENT_SECRET,
    audience: process.env.BLAMELESS_OAUTH_AUDIENCE,
    grandType: process.env.BLAMELESS_OAUTH_GRAND_TYPE,
    getOrgIdBase: process.env.BLAMELESS_ORG_ID_BASE,
    userIdBase: process.env.BLAMELESS_USER_ID_BASE,
    tempAuthToken: process.env.BLAMELESS_TEMP_AUTH_TOKEN,
    blamelessTenantBaseUrl: process.env.BLAMELESS_TENANT_BASE_URL,
}

module.exports = envConfig
