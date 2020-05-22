const fetch = require("cross-fetch");

class OAuth {
    constructor (httpConfig) {
        this.httpConfig = httpConfig;
    }

    async getAccessToken () {
        const params = {
            // eslint-disable-next-line camelcase
            grant_type: "client_credentials",
            scope: this.httpConfig.scopes,
            // eslint-disable-next-line camelcase
            client_id: this.httpConfig.clientID,
            // eslint-disable-next-line camelcase
            client_secret: this.httpConfig.clientSecret
        };
        const body = Object.entries(params)
            .map(p => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`)
            .join("&");
        return fetch(`${this.httpConfig.issuer}/token`, {
            method: "POST",
            body: body,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

module.exports = OAuth;
