# Node TypeScript Starter

> Starter kit application for projects using Express and TypeScript with MongoDB, SQL, Jest testing and much more configured out of the box.

## Introduction

Node TypeScript Starter is a starter kit for applications written in TypeScript and using Express as web framework. It comes with the following feature out of the box:

- DDD structure
- server configuration with enabled CORS
- dotenv to handle environment variables
- MongoDB integration
- MySQL / SqLite / Postgres / MsSQL integration
- Keycloak integration
- Testing through Jest

## Installation

1. Clone the repo;

2. Either 
    - copy the `env.example` file into a new `.env` file and fill in the variables;
    - set up the needed environment variables;

3. Run `npm install` to install the needed dependencies.

3. (optional) If willing to use an SQL database, set the `SQL_DIALECT` key of the `.env` file to one of the supported values: `mysql`, `sqlite`, `postgres`, `mssql` or `none`.

    Then run migrations by running `npm run migrate` and seeding via `npm run seed`.

    Migrations can be undone by running `migrate-revert` or `migrate-revert-all`.

## Running the Application

First compile the application via `npm run build`.

Then run `npm start` to simply run the application.

## Development

Run `npm run debug` to debug the applicaton or `npm run watch` to run the debugger with Nodemon.

Take a look at [this article](https://samkirkiles.svbtle.com/webstorm-node-js-debugging-with-nodemon) to integrate the debugger into WebStorm.

## Building the application

Run `npm run build` to build the application.

## Configuration and Features

### Keycloak

[Keycloak](https://www.keycloak.org/) is an open source identity and access management service, which can be used to authenticate Users and add role based permissions.

**Requirements**

In order to use Keycloak, you need to setup a Keycloak server to be used to authenticate users.

Once the server is setup, fill in the correct parameters in the `.env` files, so that the application will be able to connect to it.

**Instantiating Keycloak**

The `KeycloakConnector` class is a wrapper to the [official Node.js adapter](https://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter).

You can create a new instance simply with

```js
import KeycloakConnector from 'path/to/src/infra/keycloak';
const keycloak = new KeycloakConnector(); // takes an optional Keycloak options object
```

The constructor can take an optional Keyloak options object, for example

```js
import session from 'express-session';
import KeycloakConnector from 'path/to/src/infra/keycloak';

const memoryStore = new session.MemoryStore();

const keycloak = new KeycloakConnector({
  store: memoryStore,
  scope: 'offline_access',
});
```

**Installing the Middleware**
Once instantiated, install the middleware into your connect-capable app:

```js
const app = express();

[...]

app.use(keycloak.getMiddleware()); // takes an optional middleware options object
```

**Protecting a Route**

```js
// Simply force the user to be authenticated
app.get('/complain', keycloak.getProtectMiddleware(), complaintHandler);

// To secure a resource with an application role for the current app:
app.get('/special', keycloak.getProtectMiddleware('special'), specialHandler);

// To secure a resource with an application role for a different app:
app.get('/extra-special', keycloak.getProtectMiddleware('other-app:special'), extraSpecialHandler);

// To secure a resource with a realm role:
app.get('/admin', keycloak.getProtectMiddleware( 'realm:admin' ), adminHandler);
```

More options are available in the [official Node.js adapter documentation](https://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter).

## Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests and the watcher.

It will be used an in-memory SqLite database, against which migrations and seedings will be run. 

## Contribution Guidelines

Please follow the coding style defined in the `.tslint.json` file.

Pull requests are welcome.

## License

Node TypeScript Starter is free software distributed under the terms of the MIT license.
