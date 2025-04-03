<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Prerequisites

- Node.js >= 20.0.0
- Yarn package manager
- Docker (optional)

## Project setup for local use

1. Clone the repository:

```bash
$ git clone <repository-url>
```

2. Install depencies

```bash
$ yarn install
```

3. Run [external `Chat Service`](https://github.com/amadeus-ua/test-task-prerequisites) locally or in Docker

4. Create `.env` file. Example:

```bash
PORT=3001

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_SSL=false

EXTERNAL_WS_URL=ws://localhost:3000
EXTERNAL_HTTP_URL=http://localhost:3000
```

Or run the command and set your own values:

```bash
$ cp .env.example .env
```

In the main module there is a validation of env parameters

5. Start `PostgreSQL` database using the command:

```bash
$ docker compose up -d --build 'postgres-api'
```

PostgreSQL was chosen for storing chat data due to its strong ACID compliance, reliability, and scalability. It supports complex queries and allows efficient handling of large volumes of data. Additionally, PostgreSQL's ability to store both relational and semi-structured data (such as JSON) makes it ideal for managing chat messages, user data, and metadata in a flexible and secure way.

## Compile and run the project

1. Dev mode

```bash
$ yarn start:dev
```

2. Prod mode

```bash
$ yarn start:prod
```

3. Ping endpoint

```
GET http://localhost:3001/api
```

Response:

```
✅ Server is up and running!!!
```

## API

1. The server runs on port `http://localhost:3001` by default.
2. Global prefix set to `/api`
3. Swagger documentation for endpoints is available at:
   - http://localhost:3001/swagger
   - http://localhost:3001/api/swagger
4. Creating migrations:

```bash
$ NAME=first-migration yarn migration:create
```

## Project setup in Docker compose

1. Need to configure the .env file
2. Create `external network` in Docker

```bash
$ docker network create traffic
```

3. Before starting the [external `Chat Service`](https://github.com/amadeus-ua/test-task-prerequisites), add this external network to its configuration

```bash
services:
  chat-service:
    build: .
    ports:
      - "3000:3000"
    networks:
      - traffic
    environment:
      - PORT=3000
      - DIALOGS_COUNT=10
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/api/dialogs"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  traffic:
    external: true
```

4. Start all services (including [external `Chat Service`](https://github.com/amadeus-ua/test-task-prerequisites)) using the commands:

```bash
$ docker-compose up -d --build
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
