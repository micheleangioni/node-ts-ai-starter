# Node TypeScript Starter

> Starter kit application for projects using Express and TypeScript.

## Introduction

Node TypeScript Starter is a starter kit for applications written in TypeScript and using Express as web framework. It comes with the following feature out of the box:

- DDD structure
- server configuration with enabled CORS
- dotenv to handle environment variables
- MongoDB integration
- MySQL / SqLite / Postgres / MsSQL integration
- Testing through Jest

## Installation

1. Clone the repo;

2. Copy the `env.example` file into a new `.env` file and fill in the variables;

3. Run `npm install` to install the needed dependencies.

3. (optional) If willing to use an SQL database, set the `SQL_DIALECT` key of the `.env` file to one of the supported values: `mysql`, `sqlite`, `postgres` or `mssql`.

    Then run migrations by running `node_modules/.bin/sequelize db:migrate` and seeding via `node_modules/.bin/sequelize db:seed:all`.

    Migrations can be undone by running `node_modules/.bin/sequelize db:undo:all`.

## Running the Application

Run `npm run run` to simply run the application or `npm run start` to compile TypeScript before running it.

## Development

Run `npm run debug` to debug the applicaton or `npm run watch` to run the debugger with Nodemon.

Take a look at [this article](https://samkirkiles.svbtle.com/webstorm-node-js-debugging-with-nodemon) to integrate the debugger into WebStorm.

## Building the application

Just run `tsc` to build the application.

## Testing

Run `npm test` to run the tests or `npm run test:watch` to run the test and the watcher.

It will be used an in-memory SqLite database, against which migrations and seedings will be run. 

## Contribution Guidelines

Please follow the coding style defined in the `.tslint.json` file.

Pull requests are welcome.

## License

Node TypeScript Starter is free software distributed under the terms of the MIT license.
