class PingOneCore {
    constructor () {
        this.uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    }

    isValidClientId (clientId) {
        if (!clientId || !this.uuidRegex.test(clientId)) {
            throw new Error(
                `Invalid client ID, it should be a valid UUID. Current value: ${clientId}.`
            );
        }
    }
    isValidIssuer (issuer) {
        if (!issuer || !"^https://".test(issuer)) {
            throw new Error(
                `Your Issuer URL must start with https. Current value: ${issuer}.`
            );
        }
        return issuer && this.uuidRegex.test(issuer);
    }
}

module.exports = PingOneCore;
