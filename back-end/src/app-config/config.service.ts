import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DatabaseOptions } from '../database/database-options';
import { LoggingService } from '../logging/logging.service';
import { AppEnvVars, ApplicationEnvironment, EnvConfig } from './app-env';

/**
 * @class
 * @static
 * @name ConfigService
 * @description Reads the application environment variables and exposes to the rest of the application
 */
@Injectable()
export class ConfigService {
    /**
     * @property
     * @public
     * @static
     * @type ApplicationEnvironment
     * @name AppEnv
     * @description Application Environment Variables
     */
    public static AppEnv: ApplicationEnvironment;

    private static loggingService: LoggingService = new LoggingService(ConfigService.name);

    /**
     * @name init
     * @public
     * @static
     * @description Uses dotenv package to read the environment variables from .env file into the process.env
     * @throws Config validation error: <error message>
     * @returns void
     */
    public static init(): void {
        try {
            // On local development environment we work with .env file
            // Use dotenv package to read the config from the .env into the process.env variables
            const envFilePath = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`;

            if (fs.existsSync(envFilePath)) {
                dotenv.config({ path: envFilePath });
            }
        } catch (ex) {
            this.loggingService.error('Read .env file failed', ex.stack, ConfigService.name);
            return;
        }

        // Extract environment variables from the process.env
        const config: EnvConfig = {};
        for (const cfgKey of Object.keys(new ApplicationEnvironment())) {
            if (cfgKey in process.env) {
                config[cfgKey] = process.env[cfgKey];
            }
        }

        this.extractOptions(this.validateOptions(config));

        this.loggingService.log(config, ConfigService.name);
    }

    public static getDbConfig(): DatabaseOptions {
        return new DatabaseOptions({
            dialect: 'mariadb', // NOTE: Left hardcoded, since changing to another database server (e.g. mariadb, postgress) may break stuff, so better to recompile
            host: ConfigService.AppEnv.DB_HOST,
            port: ConfigService.AppEnv.DB_PORT,
            username: ConfigService.AppEnv.DB_USERNAME,
            password: ConfigService.AppEnv.DB_PASSWORD,
            database: ConfigService.AppEnv.DB_NAME,
            sync: ConfigService.AppEnv.DB_SYNC,
            initModels: true
        });
    }

    /**
     * @name validateOptions
     * @private
     * @static
     * @description Validates Environment variables
     * @param config 
     * @returns EnvConfig
     */
    private static validateOptions(config: EnvConfig): EnvConfig {
        const { error, value: validatedEnvConfig } = AppEnvVars.validate(
            config,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }

        return validatedEnvConfig;
    }

    /**
     * @name validateOptions
     * @private
     * @static
     * @description Extracts Environment variables from EnvConfig key/value pairs into the AppEnv object
     * @param config
     * @returns void
     */
    private static extractOptions(config: EnvConfig): void {
        this.AppEnv = {
            APP_NAME: config.APP_NAME,
            APP_HOST: config.APP_HOST,
            APP_PORT: Number(config.APP_PORT),
            DB_SYNC: config.DB_SYNC === 'yes' ? true : false,
            DB_HOST: config.DB_HOST,
            DB_PORT: Number(config.DB_PORT),
            DB_NAME: config.DB_NAME,
            DB_USERNAME: config.DB_USERNAME,
            DB_PASSWORD: config.DB_PASSWORD,
            AUTH_CONFIG_TOKEN_EXPIRY_TIME_HOURS: Number(config.AUTH_CONFIG_TOKEN_EXPIRY_TIME_HOURS),
            AUTH_CONFIG_TOKEN_SECRET_KEY: config.AUTH_CONFIG_TOKEN_SECRET_KEY,
        };
    }
}