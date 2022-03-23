
const blamelessTenantDomain = process.env.BLAMELESS_TENANT_DOMAIN
const oAuthClientId = process.env.BLAMELESS_OAUTH_CLIENT_ID
const oAuthClientSecret = process.env.BLAMELESS_OAUTH_CLIENT_SECRET
const oAuthAudience = process.env.BLAMELESS_OAUTH_AUDIENCE

const isEnvSet = () => {
    return blamelessTenantDomain?.length > 0 && oAuthClientId?.length > 0 && oAuthClientSecret?.length > 0 && oAuthAudience?.length > 0;
}

module.exports = isEnvSet
