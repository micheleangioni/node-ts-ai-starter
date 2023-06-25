# Node TypeScript Starter

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/micheleangioni/node-ts-starter?color=stable&label=version)
[![Build Status](https://github.com/micheleangioni/node-ts-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/micheleangioni/node-ts-starter/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

> Starter kit application for projects using Express and TypeScript with MongoDB, SQL, Jest testing and much more configured out of the box.

> An optionally-removable OpenAI-powered Chat endpoint powered by local memory is also available out of the box.  

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
- Chat endpoint powered by OpenAI and MemoryBuffer

## Installation

1. Clone the repo;

2. Either 
    - copy the `env.example` file into a new `.env` file and fill in the variables;
    - directly set up the needed environment variables;

3. Run `npm install` to install the needed dependencies.

4. (optional) If willing to use an SQL database, set the `SQL_DIALECT` env variable to one of the supported values: `mysql`, `sqlite`, `postgres`, `mssql` or `none`.

    Then run migrations by running `npm run migrate` and seeding via `npm run seed`.

    Migrations can be undone by running `migrate-revert` or `migrate-revert-all`.

5. (optional) If you want to remove the endpoint and logic for the AI-powered chat, follow this steps:

    - Run `npm run clear-ai`
    - Delete the unused lines in src/api/index.ts 

## Running the Application

First compile the application via `npm run build`.

Then simply run `npm start` to run it.

## Development

Run `npm run debug` to debug the application or `npm run watch` to run the debugger with Nodemon.

## Building the application

Run `npm run build` to build the application.

## Configuration and Features

### OpenAI-powered Chat

node-ts-starter comes with an OpenAI-powered chat set up out of the box. 
In order to use it, please obtain an AI key from https://platform.openai.com/account/api-keys.

The API endpoint identifies incoming requests via the ip address and context is kept in memory. 
Therefore, rebooting the application will remove all existing memory. 

Configuration

- `CHAT_MEMORY_PERSISTENCE`: How the chat discussions are persisted. Accepted values:
  - `memory`
- `OPENAI_ORGANIZATION_ID`: The organization id used by OpenAI
- `OPENAI_API_KEY`: Your API key
- `VECTOR_STORE`: Vector store to be used. Accepted values:
  - `hnswlib` (default)

- Endpoints:

 - POST `/api/llm/chat/message`
    ```
   // Body
   {
     message: <string>; // The message sent to the chat
   }
   // Response
   {
     data: <string>; // The message message
   }
    ```
   
    This endpoint allows you to chat with an LLM. It will keep track of your conversation history,
    using the IP Address of the incoming request as user identified.

  - POST `/api/llm/search/load-document`
    ```
     // Body (form-data)
     {
       file // File to be ingested
     }
     // Response
     {
       data: <string>; // A confirmation message that the file has been successfully loaded
     }
      ```

     This endpoint allows ingesting an input file to allow for future searches.

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
