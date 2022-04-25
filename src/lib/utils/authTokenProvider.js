class AuthTokenProvider {
    constructor() {
        this.authToken = null;
    }
    get authToken() {
        return this._authToken;
    }
    set authToken(newToken) {
        this._authToken = newToken;
    }
 }

 const authTokenProvider = new AuthTokenProvider();

 module.exports = authTokenProvider;