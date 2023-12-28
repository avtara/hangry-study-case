import {
    ConfigModel,
    EnvironmentVars,
    ConfigModelSchema,
  } from './config.model';
  import { config as loadConfig } from 'dotenv';
  import path from 'path';
  import { formatZodErrors } from '../utils';
  import { Service } from 'typedi';
  import { LogService } from '../logger';
  
  @Service()
  export class ConfigService {
    private config: Partial<ConfigModel> = {};
  
    constructor(private readonly logService: LogService) {}
  
    load() {
      //load environment variables.
      if (process.env['NODE_ENV'] !== 'production') {
        loadConfig({ path: path.join(process.cwd(), '.env') });
      }
  
      const _: Record<string, any> = {};
      _.db_host = process.env['DB_HOST'];
      _.db_port = process.env['DB_PORT'];
      _.db_name = process.env['DB_NAME'];
      _.db_user = process.env['DB_USER'];
      _.db_pass = process.env['DB_PASS'];
      _.port = process.env['PORT'];
  
      const validationCheck = ConfigModelSchema.safeParse(_);
  
      if (!validationCheck.success) {
        throw new Error(
          `Invalid environement config \n ${JSON.stringify(
            formatZodErrors(validationCheck.error),
            null,
            2
          )}`
        );
      }
  
      this.logService.info(
        `Successfully loaded and verified environment variables`,
        ConfigService.name
      );
  
      this.config = validationCheck.data;
    }
  
    get<T>(key: EnvironmentVars) {
      return this.config[key] as T;
    }
  }
  