import 'reflect-metadata';
import http from 'http';
import { Container } from 'typedi';
import { ConfigService } from './config';
import { PoolConfig } from 'pg';
import { DB_TOKEN, getDbClient } from './database';
import { App } from './app';
import { LOGGER_TOKEN, LogService, logger } from './logger';
Container.set(LOGGER_TOKEN, logger);

function listenAsync(server: http.Server, port: number) {
  return new Promise((resolve, reject) => {
    server.listen(port);
    server.once('listening', () => {
      resolve(null);
    });
    server.once('error', (err) => {
      reject(err);
    });
  });
}

const logService = Container.get(LogService);
async function main() {
  const configService = Container.get(ConfigService);
  configService.load();

  const poolCfg: PoolConfig = {
    host: configService.get('db_host'),
    port: configService.get('db_port'),
    user: configService.get('db_user'),
    password: configService.get('db_pass'),
    max: 25,
    database: configService.get('db_name'),
    min: 5,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
  };
  const db = getDbClient(poolCfg);
  Container.set(DB_TOKEN, db);

  try {
    const ApplicationBuilder = Container.get(App);
    const server = http.createServer(ApplicationBuilder.setup());
    await listenAsync(server, configService.get<number>('port'));
    logService.info(
      `server listning on PORT ${configService.get<number>('port')}`,
      'main'
    );
    logService.info(
      `health check path - "http://localhost:${configService.get<number>(
        'port'
      )}/api/ping"`,
      'main'
    );
    logService.info(
      `api documentation - "http://localhost:${configService.get<number>(
        'port'
      )}/docs"`,
      'main'
    );
  } catch (error) {
    logService.error(`${error}`, 'main');
    await db.destroy();
    process.exit(1);
  }
}

process.on('uncaughtException', (e) => {
  logService.error(`Uncaught Exception: ${e}`, 'main');
});

main();
