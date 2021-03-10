import * as Joi from '@hapi/joi';

/**
 * @file app-env.ts
 * @description Wraps the schemas of the Application Environment Variables
 */

/**
 * @type Record<string, any>
 * @name EnvConfig
 * @description Defines Environment Configuration type (Key/Value) redords
 */
type EnvConfig = Record<string, any>;

/**
 * @class
 * @name ApplicationEnvironment
 * @description Application Environment Variables data structure
 */
class ApplicationEnvironment {
    constructor(partial: Partial<ApplicationEnvironment> = {}) {
        this.APP_NAME = 'auth-be';
        this.APP_HOST = 'localhost';
        this.APP_PORT = 9008;

        this.DB_SYNC = true;
        this.DB_HOST = 'localhost';
        this.DB_PORT = 3307;
        this.DB_NAME = 'auth_stack';
        this.DB_USERNAME = '';
        this.DB_PASSWORD = ''

        this.AUTH_CONFIG_TOKEN_EXPIRY_TIME_HOURS = 24;
        this.AUTH_CONFIG_TOKEN_SECRET_KEY = 'jwt-secret-key-12345!!!';

        Object.assign(this, partial);
    }

    public APP_NAME: string;
    public APP_HOST: string;
    public APP_PORT: number;
    public DB_SYNC: boolean;
    public DB_HOST: string;
    public DB_PORT: number;
    public DB_NAME: string;
    public DB_USERNAME: string;
    public DB_PASSWORD: string;
    public AUTH_CONFIG_TOKEN_SECRET_KEY: string;
    public AUTH_CONFIG_TOKEN_EXPIRY_TIME_HOURS: number;
}

/**
 * @name AppEnvVars
 * @type Joi.ObjectSchema
 * @description Defines the schema and default values for the Application Environment Variables
 */
const AppEnvVars: Joi.ObjectSchema = Joi.object({
    APP_NAME: Joi.string().default('auth-be'),
    APP_HOST: Joi.string().default('0.0.0.0'),
    APP_PORT: Joi.number().default(9008),
    DB_SYNC: Joi.string().default('yes'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(3307),
    DB_NAME: Joi.string().default('auth_stack'),
    DB_USERNAME: Joi.string().default(''),
    DB_PASSWORD: Joi.string().default(''),
    AUTH_CONFIG_TOKEN_SECRET_KEY: Joi.string().default('jwt-secret-key-12345!!!'),
    AUTH_CONFIG_TOKEN_EXPIRY_TIME_HOURS: Joi.number().default(24),

});

export { EnvConfig, AppEnvVars, ApplicationEnvironment };

