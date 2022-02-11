# Node TypeScript Starter

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/micheleangioni/node-ts-starter?color=stable&label=version)
[![Build Status](https://github.com/micheleangioni/node-ts-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/micheleangioni/node-ts-starter/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

> Starter kit application for projects using Express and TypeScript with MongoDB, SQL, Jest testing and much more configured out of the box.

## Introduction

Node TypeScript Starter is a starter kit for applications written in TypeScript and using Express as web framework. 
It comes with the following features configured out of the box:

- DDD structure
- Server configuration with enabled CORS
- dotenv to handle environment variables
- MongoDB integration
- MySQL / SqLite / Postgres / MsSQL integration
- Domain Events via [Apache Kafka](https://kafka.apache.org/)
- Testing through Jest
- Modern .eslintrc configuration

## Installation

1. Clone the repo;

2. Either 
    - copy the `env.example` file into a new `.env` file and fill in the variables;
    - directly set up the needed environment variables;

3. Run `npm install` to install the needed dependencies.

4. (optional) If willing to use an SQL database, set the `SQL_DIALECT` env variable to one of the supported values: `mysql`, `sqlite`, `postgres`, `mssql` or `none`.

    Then run migrations by running `npm run migrate` and seeding via `npm run seed`.

    Migrations can be undone by running `migrate-revert` or `migrate-revert-all`.

## Running the Application

First compile the application via `npm run build`.

Then simply run `npm start` to run it.

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
- `KAFKA_CLIENT_ID`: client id for the Kafka connection. If not set, a random generated will be used;
- `KAFKA_LOG_LEVEL`: set the logging level of the Kafka client:
    - `0` = nothing
    - `1` = error
    - `2` = warning
    - `4` = info (default)
    - `5` = debug
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
}
```

## Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests with the watcher.

The tests will use both a MongoDB and an in-memory SqLite database, against which migrations and seedings will be run. 

## Running the Application

### Docker

Node TypeScript Starter comes with a Dockerfile out of the box. 
In order to locally run the Container, just make sure to have Docker installed and run:

- (Optional) `docker-compose up` (or `TMPDIR=/private$TMPDIR docker-compose up` on MacOS) to run the docker-compose with the needed dependencies
- `docker build -t node-ts-start .` to build the Container
- `docker run -dp 3010:3010 node-ts-start` to run it. The application will be served on the port 3010

## Going Serverless

If you are interested in Serverless architecture, take a look at [Serverless Node TypeScript](https://github.com/micheleangioni/sls-node-ts),
a starter kit ready for Serverless deployment out of the box. 

## Contribution Guidelines

Pull requests are welcome.

## License

Node TypeScript Starter is free software distributed under the terms of the MIT license.
