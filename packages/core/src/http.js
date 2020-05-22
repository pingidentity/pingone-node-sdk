const fetch = require("cross-fetch");
const OAuth = require("./oauth");

const PUT_METHOD = "put";
const POST_METHOD = "post";

class Http {
    constructor (httpConfig) {
        this.oauth = new OAuth(httpConfig);
    }

    async addAccessToken (request) {
        if (!this.oauth) {
            return Promise.resolve();
        }

        if (typeof this.accessToken === "undefined") {
            const getToken = await this.oauth.getAccessToken();
            const accessTokenResponse = await this.errorFilter(getToken);
            this.accessToken = await accessTokenResponse.json();
        }
        request.headers.Authorization = `Bearer ${this.accessToken.access_token}`;
    }

    async errorFilter (response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
    }

    async http (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.method = request.method || "get";
        await this.addAccessToken(request);
        const response = await fetch(uri, request);
        return this.errorFilter(response);
    }

    async delete (uri, request) {
        return this.http(uri, Object.assign(request || {}, { method: "delete" }));
    }

    async json (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.headers = Object.assign(
            {
                Accept: "application/json"
            },
            request.headers
        );
        return this.http(uri, request).then(res => res.json());
    }

    async getJson (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.method = "get";
        return this.json(uri, request);
    }

    async post (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.method = POST_METHOD;
        return this.http(uri, request);
    }

    async postJson (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.method = POST_METHOD;
        request.body = JSON.stringify(request.body);
        return this.json(uri, request);
    }

    async patchJson (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.method = "patch";
        request.body = JSON.stringify(request.body);
        return this.json(uri, request);
    }

    async putJson (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.method = PUT_METHOD;
        request.body = JSON.stringify(request.body);
        return this.json(uri, request);
    }

    async put (uri, request) {
    // eslint-disable-next-line no-param-reassign
        request = request || {};
        request.method = PUT_METHOD;
        return this.http(uri, request);
    }
}

module.exports = Http;
