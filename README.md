# Hangry Project

**Base**

- [node](https://nodejs.org/en)
- [typescript](https://www.typescriptlang.org/)
- [express](https://expressjs.com/)
- [postgresql](https://www.postgresql.org/)

**Libraries**

- [zod](https://github.com/colinhacks/zod) - validations.
- [typedi](https://github.com/typestack/typedi) - depedency injection tool.
- [dotenv](https://github.com/motdotla/dotenv) - config loader in development.
- [kysely](https://github.com/kysely-org/kysely) - query builder for postgres.
- [winston](https://github.com/winstonjs/winston) - logger.

**Code quality & formatting**

- [prettier](https://prettier.io/)
- [eslint](https://eslint.org/)

**Other integrations**

- [docker](https://docs.docker.com/)
- [pgadmin](https://www.pgadmin.org/)

## Setup

1. You need Docker installed, it's required.
2. Clone this repo.
3. Create a `.env` file in the root directory, see `example.env`
4. create a `integrations.env` in root of the project, see `example.initial.env`

## How to run

```shell
$ docker compose up -d
```

## License

MIT
