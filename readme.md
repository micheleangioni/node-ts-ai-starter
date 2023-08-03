# Node TypeScript AI Starter

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/micheleangioni/node-ts-ai-starter?color=stable&label=version)
[![Build Status](https://github.com/micheleangioni/node-ts-ai-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/micheleangioni/node-ts-ai-starter/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)

> Starter kit application for AI-driven projects, written in TypeScript and using Fastify with MongoDB, Apache Kafka, Jest testing and much more configured out of the box.

## Introduction

Node TypeScript AI Starter is a starter kit for AI-driven applications written in TypeScript and using Fastify as web framework. 
It comes with the following features configured out of the box:

- Domain Driven Design (DDD) structure
- Server configuration with enabled CORS
- dotenv to handle environment variables
- MongoDB integration
- Domain Events via [Apache Kafka](https://kafka.apache.org/)
- Testing via Jest
- Modern .eslintrc configuration
- Chat endpoint powered by OpenAI and MemoryBuffer
- Endpoints to ingest documents and query them, powered by OpenAI + hnswlib/Redis

## Content

- [Installation](#installation)
- [Development](#development)
- [Running the Application](#running)
- [Configuration](#configuration)
  - [Environment variables](#env)
- [Features](#features)
  - [Chat](#chat)
  - [Document Ingestion and Querying](#document-ingestion-and-querying)
  - [Domain Events](#domain-events)
- [Testing](#testing)
- [Contribution Guidelines](#guidelines)
- [License](#license)

## <a name="installation"></a>Installation

Be sure to use Node.js v18 or greater.

1. Clone the repo;

2. Either 
    - copy the `env.example` file into a new `.env` file and fill in the variables, or
    - directly set up the needed environment variables.

3. Run `npm install` to install the needed dependencies.

4. (optional) If you want to remove the AI endpoints and logic for the AI-powered chat, follow this steps:

    - Run `npm run clear-ai`
    - Delete the unused lines in `src/api/index.ts`

## <a name="development"></a>Development

For local development Node TypeScript AI Starter is shipped with a docker-compose file.

Simply run `docker-compose up` (or `TMPDIR=/private$TMPDIR docker-compose up` on MacOS) to spin up the containers.
Then run `npm run debug` to debug the application, or `npm run watch` to run the debugger with Nodemon.

## <a name="running"></a>Running the Application

Node TypeScript AI Starter comes with a Dockerfile out of the box.
In order to locally run the containers, just make sure to have Docker installed and run:

- (Optional) `docker-compose up` (or `TMPDIR=/private$TMPDIR docker-compose up` on MacOS) to run the docker-compose with the needed dependencies
- `docker build -t node-ts-ai-starter .` to build the Container
- `docker run -dp 3010:3010 node-ts-ai-starter` to run it. The application will be served on the port 3010

Alternatively, you can the application directly via `npm run build` and then `npm start` to run it.

## <a name="configuration"></a>Configuration

### <a name="env"></a>Environment Variables

**Main Application**

- `NODE_ENV` : Set the environment name, default is `development`
- `PORT` : Port the server will be available in
- `MONGO_URI` : Set the complete MongoDB connection string. Default `mongodb://localhost:27017/node-ts-ai-starter_<NODE_ENV>}`, where `<NODE_ENV>` in the `NODE_ENV` env variable value
- `DEBUG_MODE`: Set the value to `'1'` to run the application in Debug Mode, i.e. max logging

**OpenAI and AI-powered Features**

- `CHAT_MEMORY_PERSISTENCE`: How the chat discussions are persisted. Accepted values:
    - `memory`
- `OPENAI_ORGANIZATION_ID`: The organization id used by OpenAI
- `OPENAI_API_KEY`: Your API key
- `OPEN_AI_MODEL`: The OpenAI model you want to use. Default: `gpt-3.5-turbo`
- `REDIS_URL`: If using Redis as Vector store, the Redis URL is required
- `REDIS_PASSWORD`= If using Redis as Vector store, and the instance is password protected
- `VECTOR_STORE`: Vector store to be used. Accepted values:
    - `hnswlib` (default)
    - `redis`

**Apache Kafka**

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

## <a name="features"></a>Features

Node TypeScript AI Starter comes with some AI-powered features set up out of the box. 
In order to use them, please obtain an AI key from https://platform.openai.com/account/api-keys.

Check the `/src/config/index.ts` file to customise the behaviour of the LLM.

### <a name="chat"></a>Chat

The API endpoint allows the user to chat with ChatGPT. 

It identifies incoming requests via the ip address and context is kept in memory.
Therefore, rebooting the application will remove all existing context.

**Endpoints**

 - POST `/api/llm/chat/message`
    ```
   // Body
   {
     message: <string>; // The message sent to the chat
   }
   // Response
   {
     data: <string>; // The message returned from the chat
   }
    ```
   
    This endpoint allows to chat with the LLM. It will keep track of your conversation history,
    using the IP Address of the incoming request as user identified.

### <a name="document-ingestion-and-querying"></a>Document Ingestion and Querying

The following endpoints allow to ingest documents storing their embeddings into a Vector Database and query them using a LLM.

Modifying or updating a previously ingested document is not supported. 
You will need to clean the Vector Database and ingest all documents again.

**Endpoints**

  - POST `/api/llm/search/documents`
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

     This endpoint allows ingesting an input file.


  - GET `/api/llm/search/documents`
    ```
    // Query Params
    {
      query: <string> Query to be sent to search in the documents
    }
    // Response
    {
      data: <string>; // The response to the input query, which the relevant information, if found.
    }
    ```

    This endpoint allows to directly query the documents previously ingested. 


  - DELETE `/api/llm/search/documents`
    ```
    // Response
    {
      data: <string>; // A confirmation message that the Vector Store has been successfully cleaned
    }
    ```

  This endpoint allows to remove all data previously added to the Vector Store. 

### <a name="domain-events"></a>Domain Events

Domain Events will be automatically published when a User is created or updated. 
The [Node Messagebrokers](https://github.com/micheleangioni/node-messagebrokers) package is used to publish to Apache Kafka.

The following events are published to the topic specified in the config file `src/config/index.ts` 
(default is `the myCompany.events.node-ts-ai-starter.user`). 

Topic names should follow the name structure `<company>.events.<application_name>.<aggregate_name>`.

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

## <a name="testing"></a>Testing

Run `npm test` to run the tests or `npm run watch-test` to run the tests with the watcher.

## <a name="guidelines"></a>Contribution Guidelines

Pull requests are welcome.

## <a name="license"></a>License

Node TypeScript AI Starter is free software distributed under the terms of the MIT license.
