const {Http} = require("@ping-identity/p14c-js-sdk-core");

/**
 * Base client to work with PingOne API
 *
 * @class PingOneApiClient
 */
class PingOneApiClient {
    constructor (config) {
        this.config = config;
        this.config.issuer = `${
            config.AUTH_URI ? config.AUTH_URI : "https://auth.pingone.com"
        }/${config.environmentId}/as`;
        this.apiUrl = `${
            config.API_URI ? config.API_URI : "https://api.pingone.com"
        }/v1/environments/${config.environmentId}`;
        this.accessToken = config.accessToken;
        this.http = new Http();
    }

    /**
   * Register a new user.
   *
   * @param {string} email user email
   * @param {string} username user name
   * @param {string} populationId population id user belongs to
   * @returns {*} new user
   */
    async addUser (email, username, populationId) {
        const url = `${this.apiUrl}/users`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }
        return this.http.postJson(url, {
            body: {
                email: email,
                username: username,
                population: {
                    id: populationId
                }
            },
            headers: {
                "Content-type": "application/json"
            },
            accessToken: this.accessToken
        });
    }

    /**
   * Delete user
   * @param {string} userId user id
   * @returns {Promise<*>} result of user deletion
   */
    async deleteUser (userId) {
        const url = `${this.apiUrl}/users/${userId}`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }
        return this.http.delete(url, {accessToken: this.accessToken});
    }

    /**
   * Find user
   * @param {string} userName - user name
   * @returns {Promise} - promise of  found user
   */
    async findUser (userName) {
        const url = `${this.apiUrl}/users?filter=email eq "${userName}" or username eq "${userName}"`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }
        return this.http.getJson(url, {accessToken: this.accessToken});
    }

    /**
   * Get all populations
   * @returns {Promise} - promise of all populations in this environment
   */
    async getPopulations () {
        const url = `${this.apiUrl}/populations`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }
        return this.http.getJson(url, {accessToken: this.accessToken});
    }

    /**
   * Update user attribute values specified in the request body. Attributes omitted from the request body are not updated or removed
   * @function updateUser
   * @param  {string}  userId      - user Id
   * @param {string} firstName     - user's first name
   * @param {string} lastName      - user's last name
   * @returns {Promise} - promise of update endpoint response
   *
   */
    async updateUser (userId, firstName, lastName) {
        const url = `${this.apiUrl}/users/${userId}`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }
        return this.http.patchJson(url, {
            body: {
                name: {
                    given: firstName,
                    family: lastName
                }
            },
            accessToken: this.accessToken
        });
    }

    /**
   * Change user password
   * @param {string} userId               - user Id
   * @param {string} currentPassword      - user current password
   * @param {string} newPassword      - user new password
   * @returns {Promise} - promise of change passport endpoint response
   */
    async changePassword (userId, currentPassword, newPassword) {
        const url = `${this.apiUrl}/users/${userId}/password`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }

        return this.http.putJson(url, {
            body: {
                currentPassword: currentPassword,
                newPassword: newPassword
            },
            headers: {
                "Content-type": "application/vnd.pingidentity.password.reset+json"
            },
            accessToken: this.accessToken
        });
    }

    /**
   * Set user password
   * @param {string} userId               - user Id
   * @param {string} password               - user password
   * @param {boolean} forceChange               - true if you forcing a change
   * @returns {Promise} - promise of setting user password response
   */
    async setPassword (userId, password, forceChange = false) {
        const url = `${this.apiUrl}/users/${userId}/password`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }

        return this.http.putJson(url, {
            body: {
                value: password,
                forceChange: forceChange
            },
            headers: {
                "Content-type": "application/vnd.pingidentity.password.set+json"
            },
            accessToken: this.accessToken
        });
    }

    /**
   * Send recovery code
   * @param {string} userId               - user Id
   * @returns {Promise} - promise of sending recovery code response
   */
    async sendRecoveryCode (userId) {
        const url = `${this.apiUrl}/users/${userId}/password`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }

        return this.http.postJson(url, {
            headers: {
                "Content-type":
          "application/vnd.pingidentity.password.sendRecoveryCode+json"
            },
            accessToken: this.accessToken
        });
    }

    /**
   * Recover user password
   * @param {string} userId               - user Id
   * @param {string} recoveryCode               - recovery code user received
   * @param {string} newPassword               - user new password
   * @returns {Promise} - promise of recovering user password response
   */
    async recoverPassword (userId, recoveryCode, newPassword) {
        const url = `${this.apiUrl}/users/${userId}/password`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }

        return this.http.postJson(url, {
            body: {
                recoveryCode: recoveryCode,
                newPassword: newPassword
            },
            headers: {
                "Content-type": "application/vnd.pingidentity.password.recover+json"
            },
            accessToken: this.accessToken
        });
    }

    /**
   * Get password pattern
   * @returns {Promise} - promise of found password pattern response
   */
    async getPasswordPattern () {
        const url = `${this.apiUrl}/passwordPolicies`;
        if (!this.accessToken) {
            this.accessToken = await this.getAccessToken();
        }

        return this.http.getJson(url, {accessToken: this.accessToken}).then(policies => {
            const passwordPolicies = policies._embedded.passwordPolicies;
            const defaultPasswordPolicy = passwordPolicies.filter(
                policy =>
                    (policy.default === true &&
            policy.minCharacters &&
            policy.maxRepeatedCharacters) ||
          policy.name === "Standard"
            );
            if (defaultPasswordPolicy) {
                let passwordPattern = "^(?:";
                // Construct lookahead assertion for each policy with "minCharacters" group
                const minCharacters = defaultPasswordPolicy[0].minCharacters;
                for (const pattern in minCharacters) {
                    // Escape all special for javascript characters
                    passwordPattern = `${passwordPattern}(?=(?:.*[${pattern.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    )}]){${minCharacters[pattern]},})`;
                }
                // Set how many consecutive characters are allowed
                passwordPattern = `${passwordPattern})(?!.*(.)\\1{${defaultPasswordPolicy[0].maxRepeatedCharacters},})`;
                // Set how many characters password should have
                // eslint-disable-next-line max-len
                passwordPattern = `${passwordPattern}.{${defaultPasswordPolicy[0].length.min},${defaultPasswordPolicy[0].length.max}}$`;
                return passwordPattern;
            }
        });
    }

    async getAccessToken () {
        const params = {
            // eslint-disable-next-line camelcase
            grant_type: "client_credentials",
            scope: this.config.scopes,
            // eslint-disable-next-line camelcase
            client_id: this.config.clientId,
            // eslint-disable-next-line camelcase
            client_secret: this.config.clientSecret
        };
        const body = Object.entries(params)
            .map(p => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`)
            .join("&");
        const response = await this.http.fetch(`${this.config.issuer}/token`, {
            method: "POST",
            body: body,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        const accessToken = await response.json();
        if (!accessToken || !accessToken.access_token) {
            throw new Error("Could not get access_token");
        } else {
            return accessToken.access_token;
        }
    }
}
module.exports = PingOneApiClient;
