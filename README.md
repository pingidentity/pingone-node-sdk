# PingOne for Customers Node.js client SDK

This is a Node.js client SDK for communicating with PingOne for Customers OAuth 2.0 and OpenID Connect provider and its API.

It allows you to implement OAuth 2.0 authorization to access PingOne for Customers management APIs from a JavaScript web application.

# Requirements
Requires Node.js version 10.13.0 or higher.

# Installation

**Using npm:**
- To work with `ApiClient` run : `npm install @pingone/nodejs-sdk-api` or `yarn add @pingone/nodejs-sdk-api`
- To work with `Http` run : `npm install @pingone/nodejs-sdk-core` or `yarn add @pingone/nodejs-sdk-core`
- To work with `JwtVerifier` run: `npm install @pingone/nodejs-sdk-jwtVerifier` or `yarn add @pingone/nodejs-sdk-jwtVerifier`

# Getting Started

## Step 1: Configure the client object

Configure `ApiClient` object that will allow your application to obtain user authorization and to make authorized API requests.
You should only have one instance of the client that will identify the scopes your application is requesting permission to access.

```javascript
const ApiClient = require("@pingone/nodejs-sdk-api");

const pingApiClient = new ApiClient({
  environmentID: "environmentID",
  clientID: "clientID",
  clientSecret: "clientSecret",
  scopes: "someScope",

  API_URI: "https://api.pingone.com",
  AUTH_URI: "https://auth.pingone.com"
});
```

, where

- `environmentID`: _Required_. Your application's Environment ID. You can find this value at your Application's Settings under
  **Configuration** tab from the admin console( extract `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` string that specifies the environment 128-bit universally unique identifier ([UUID](https://tools.ietf.org/html/rfc4122)) right from `https://auth.pingone .com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/as/authorize`
  _AUTHORIZATION URL_ ). Or from the _Settings_ main menu (_ENVIRONMENT ID_ variable)
- `clientID`: _Required_. Your application's client UUID. You can also find this value at Application's Settings right under the
  Application name.
- `clientSecret`: _Required_. Your application's client secret.
- `scopes`: _Optional_. scope: standard OIDC or PingOne custom scopes, separated by a space which you want to request authorization for.
- `API_URI`: PingOne API base endpoint (default value is `https://api.pingone.com`)
- `AUTH_URI`: PingOne Authentication base endpoint (default value is `https://auth.pingone.com`)

## Step 2: Calling the API

| Method Name                                          | Description                                                                                                                                                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addUser(email, username, populationId)               | [Create a new user](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/#Users)                                                                                                                                           |
| deleteUser(userId)                                   | Delete a user                                                                                                                                                                                                                               |
| findUser(userName)                                   | [Find a user by his name or email](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/#Users)                                                                                                                            |
| updateUser(userId, firstName, lastName)              | Update user first and last names                                                                                                                                                                                                            |
| getPasswordPattern()                                 | [Get all password policies for an environment to get the default one](<(https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Passwords/#Get-one-password-policy)>). It will be used for password verification on the client side |
| getPopulations()                                     | [Get all populations for a new user registration](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Populations/#Get-populations)                                                                                             |
| sendRecoveryCode(userId)                             | Send password recovery code                                                                                                                                                                                                                 |
| recoverPassword(userId, recoveryCode, newPassword)   | [Recover a forgotten password](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/p1_Password/#Recover-password)                                                                                                         |
| changePassword(userId, currentPassword, newPassword) | [Self-change reset of user password](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/p1_Password/#Update-a-users-password)                                                                                            |
| setPassword(userId, password, forceChange = false)   | [Administrative-change reset of user password](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/p1_Password/#Update-a-users-password)                                                                                  |
