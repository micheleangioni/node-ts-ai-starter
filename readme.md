# Node TypeScript Starter

[![Build Status](https://api.travis-ci.org/micheleangioni/node-ts-starter.svg?branch=master)](https://travis-ci.org/micheleangioni/node-ts-starter)

> Starter kit application for projects using Express and TypeScript with MongoDB, SQL, Jest testing and much more configured out of the box.

## Introduction

Node TypeScript Starter is a starter kit for applications written in TypeScript and using Express as web framework. It comes with the following feature out of the box:

- DDD structure
- server configuration with enabled CORS
- dotenv to handle environment variables
- MongoDB integration
- MySQL / SqLite / Postgres / MsSQL integration
- Domain Event via Kafka Message Broker
- Keycloak integration
- Testing through Jest

## Installation

1. Clone the repo;

2. Either 
    - copy the `env.example` file into a new `.env` file and fill in the variables;
    - directly set up the needed environment variables;

3. Run `npm install` to install the needed dependencies.

3. (optional) If willing to use an SQL database, set the `SQL_DIALECT` key of the `.env` file to one of the supported values: `mysql`, `sqlite`, `postgres`, `mssql` or `none`.

    Then run migrations by running `npm run migrate` and seeding via `npm run seed`.

    Migrations can be undone by running `migrate-revert` or `migrate-revert-all`.

## Running the Application

First compile the application via `npm run build`.

Then run `npm start` to simply run the application.

## Development

Run `npm run debug` to debug the application or `npm run watch` to run the debugger with Nodemon.

Take a look at [this article](https://samkirkiles.svbtle.com/webstorm-node-js-debugging-with-nodemon) to integrate the debugger into WebStorm.

## Building the application

Run `npm run build` to build the application.

## Configuration and Features

### Domain Events

Domain Events will be automatically published when a User is created or updated. 
The [Node Messagebrokers](https://github.com/micheleangioni/node-messagebrokers) package is used to publish to Apache Kafka.

The following events are published to the topic specified in the config file `src/config/index.ts` 
(default is `the myCompany.events.node-ts-starter.user`). 

Topic names should follow the name structure `<company>.events.<application_name>.<aggregate_name>`.

Apache Kafka can be configured through the following environment variables:

- `ENABLE_MESSAGE_BROKER`: `'true'` or `'false'`, whether domain events are published. Default `'false'`;
- `KAFKA_URI`: URI of the Kafka Message Broker. Default `localhost:9092`;
- `SSL_CERT`: SSL certificate (string);
- `SSL_KEY`: SSL key (string);
- `SSL_CA`: SSL certificate authority (string);
- `REVERSE_DNS`: Reverse DNS to customise the type field of the event payload.

The following events are emitted by the Application:

- `UserCreated`: A new User has been created
```
{ 
  id: <string | integer>,
  createdAt: <string>,
  email: <string>,
  username: <string | undefined>
```

## Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests with the watcher.

It will be used an in-memory SqLite database, against which migrations and seedings will be run. 

## Contribution Guidelines

Pull requests are welcome.

## License

Node TypeScript Starter is free software distributed under the terms of the MIT license.
