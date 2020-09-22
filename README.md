# PingOne for Customers Node.js client SDK

[![NPM version](https://img.shields.io/npm/v/@ping-identity/p14c-node-sdk.svg)](https://www.npmjs.com/package/@ping-identity/p14c-node-sdk)
[![NPM downloads](https://img.shields.io/npm/dm/@ping-identity/p14c-node-sdk.svg)](https://www.npmjs.com/package/@ping-identity/p14c-node-sdk)

The official PingOne for Customers(P14C) SDK for Node.js, that allows Node.js applications to operate with P14C platform APIs without user interaction. 

For release notes, see the [CHANGELOG](CHANGELOG.md).

###NOTE: 
**THIS REPOSITORY IS IN A TESTING MODE AND IS NOT READY FOR PRODUCTION**

## Content
 1. [Requirements](#requirements)
 1. [Installation](#installation)
 1. [Getting Started](#getting-started)
 1. [Authentication Flows](#authentication-flows)
 
# Requirements

- P14C account (if you don’t have an existing one, please register it).
- [P14C worker application](https://apidocs.pingidentity.com/pingone/platform/v1/api/#getting-started).
To access PingOne resources the application should be configured with a `client_credentials` grant type, the application's type property must be set to `WORKER` and the worker application should be assigned one or more roles. 
- Node.js version 10.13.0 or higher.

# Installation


To install [@ping-identity/p14c-nodejs-sdk](https://www.npmjs.com/package/@ping-identity/p14c-nodejs-sdk) you can run these commands in your project root folder:

```bash
# yarn
yarn add @ping-identity/p14c-nodejs-sdk
```
or
```
# npm
npm install --save @ping-identity/p14c-nodejs-sdk
```

# Getting Started

## Step 1: Configure the client object

Configure `PingOneApiClient` object that will allow your application to make authorized API requests.
You should only have one instance of the client with scopes your application is requesting permission to access.

This SDK works with administrator applications that use role assignments to determine the actions a user or client can perform.
So the access tokens do not use scopes to control access to resources. Instead, the actor's role assignments determine resource access.

You can create `PingOneApiClient` in 2 ways:
1. with `clientId` and `clientSecret` parameters that behind the scenes will use Client Credentials Grant to obtain the `access_token` and will be cached for the duration of the returned `expires_in` value.
```javascript
const PingOneApiClient = require("@ping-identity/p14c-nodejs-sdk");

const pingApiClient = new PingOneApiClient({
  environmentId: "environmentId",
  clientId: "clientId",
  clientSecret: "clientSecret"
});
```
2. with `accessToken` parameter obtained from P14C admin console in "Configuration" tab. 
```javascript
const PingOneApiClient = require("@ping-identity/p14c-nodejs-sdk");

const pingApiClient = new PingOneApiClient({
  environmentId: "environmentId",  
  accessToken: "accessToken"
})
```

, where
- `environmentId`: _Required_. Your application's Environment ID. You can find this value at your Application's Settings under
  **Configuration** tab from the admin console( extract `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` string that specifies the environment 128-bit universally unique identifier ([UUID](https://tools.ietf.org/html/rfc4122)) right from `https://auth.pingone .com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/as/authorize`
  _AUTHORIZATION URL_ ). Or from the _Settings_ main menu (_ENVIRONMENT ID_ variable)

- `clientId`: _Required in the #1 way_. Your application's client UUID. You can find this value at Application's Settings under **Configuration** tab from the admin console.

- `clientSecret`: _Required in the #1 way_. Your application's client secret.

- `accessToken`: _Required in the #2 way_. Access token retrieved from the admin console.

- `API_URI`:  _Optional_. P14C API base endpoint (default value is `https://api.pingone.com`)

- `AUTH_URI`:  _Optional_. P14C Authentication base endpoint (default value is `https://auth.pingone.com`)


```javascript
const PingOneApiClient = require("@ping-identity/p14c-nodejs-sdk");

const pingApiClient = new PingOneApiClient({
  environmentId: "environmentId",
  accessToken: "accessToken",

  API_URI: "https://api.pingone.com",
  AUTH_URI: "https://auth.pingone.com"
});
```


## Step 2: Calling the API

| Method Name                                          | Description                                                                                                                                                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addUser(email, username, populationId)               | [Create a new user](https://apidocs.pingidentity.com/pingone/platform/v1/api/#post-create-user)                                                                                                                                           |
| deleteUser(userId)                                   | Delete a user                                                                                                                                                                                                                               |
| findUser(userName)                                   | [Find a user by his name or email](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/#Users)                                                                                                                            |
| updateUser(userId, firstName, lastName)              | Update user first and last names                                                                                                                                                                                                            |
| getPasswordPattern()                                 | [Get all password policies for an environment to get the default one](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Passwords/#Get-one-password-policy). It will be used for password verification on the client side |
| getPopulations()                                     | [Get all populations for a new user registration](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Populations/#Get-populations)                                                                                             |
| sendRecoveryCode(userId)                             | Send password recovery code                                                                                                                                                                                                                 |
| recoverPassword(userId, recoveryCode, newPassword)   | [Recover a forgotten password](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/p1_Password/#Recover-password)                                                                                                         |
| changePassword(userId, currentPassword, newPassword) | [Self-change reset of user password](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/p1_Password/#Update-a-users-password)                                                                                            |
| setPassword(userId, password, forceChange = false)   | [Administrative-change reset of user password](https://apidocs.pingidentity.com/pingone/customer/v1/api/man/p1_Users/p1_Password/#Update-a-users-password)                                                                                  |


# Authentication Flows

## Client credentials Grant

This SDK is build for Node.js based web applications that run within a typical deployment model - on a secure server.  
In such cases the assumption holds — the application can authenticate securely and **PKCE is unnecessary**.

[Client credentials flow](https://apidocs.pingidentity.com/pingone/platform/v1/api/#post-token-admin-app-client_credentials) is used to obtain the `access_token`.

## Authorization Code Grant using Proof Key for Code Exchange (PKCE)

Although with Node.js, JavaScript is not limited to the front-end only, but works outside of the browser as well.
With frameworks such as Electron or NW.js, it’s possible to develop native desktop applications using web technologies like HTML, CSS and JavaScript. 
Desktop and mobile applications can be distributed directly to end-users, thereby any secrets embedded within are no longer secret, and could be publicly known.

As a result, **PKCE is necessary in these cases**. 

For such cases you should use [PingOne SDK for JavaScript](https://github.com/pingidentity/pingone-javascript-sdk.git) that allows you to expose self-managed user authenticated APIs.

# Development Notes
This library uses `@ping-identity/p14c-js-sdk-core` not from npm registry, but the newly build version in [github](https://github.com/pingidentity/pingone-javascript-sdk/tree/master/packages/core/dist/node/%40ping-identity).
You can copy it's content and put it instead of `/pingone-node-sdk/node_modules/@ping-identity/p14c-js-sdk-core/dist/node` it or make a symlink `ln -s /pingone-javascript-sdk/packages/core/* /pingone-node-sdk/node_modules/@ping-identity/p14c-js-sdk-core`

