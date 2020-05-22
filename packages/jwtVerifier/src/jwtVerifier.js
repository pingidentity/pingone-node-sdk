const jwksClient = require("jwks-rsa");
const nJwt = require("njwt");

class JwtVerifier {
    constructor (config = {}) {
        this.customClaims = config.customClaims || {};
        this.issuer = config.issuer;
        this.verifier = nJwt
            .createVerifier()
        // All tokens in PingOne are JWTs signed using the RS256 signing algorithm.
            .setSigningAlgorithm("RS256")
            .withKeyResolver(this.keyResolver);
    }

    keyResolver (kid, cb) {
        return jwksClient({
            jwksUri: `${this.issuer}/v1/keys`,
            cacheMaxAge: 60 * 60 * 1000,
            jwksRequestsPerMinute: 5,
            cacheMaxEntries: 4,
            rateLimit: true,
            cache: true
        }).getSigningKey(kid, (err, key) => {
            cb(err, key && (key.publicKey || key.rsaPublicKey));
        });
    }

    async validateToken (tokenString) {
        return this.verifier.verify(tokenString, (err, jwt) => {
            if (err) {
                throw new Error(err);
            }
            jwt.claims = jwt.body;
            jwt.body = undefined;

            return jwt;
        });
    }

    verifyAccessToken (tokenString, expectedAudience) {
        const jwt = this.validateToken(tokenString);
        // Verify audience claim since njwt doesn't do that
        if (!expectedAudience) {
            throw new Error("Audience claim is required");
        }
        if (
            Array.isArray(expectedAudience) &&
      !expectedAudience.includes(jwt.claims.aud)
        ) {
            throw new Error(
                `Audience claim ${
                    jwt.claims.aud
                } does not match one of the expected audiences: ${expectedAudience.join(
                    ", "
                )}`
            );
        }
        // Verify issuer and audience claims
        if (
            !Array.isArray(expectedAudience) &&
      jwt.claims.aud !== expectedAudience
        ) {
            throw new Error(
                `Audience claim ${jwt.claims.aud} does not match expected audience: ${expectedAudience}`
            );
        }
        if (jwt.claims.iss !== this.issuer) {
            throw new Error(
                `Issuer claim ${jwt.claims.iss} does not match expected issuer: ${this.issuer}`
            );
        }

        return jwt;
    }
}

module.exports = JwtVerifier;
