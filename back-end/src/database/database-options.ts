import { Dialect } from 'sequelize/types';

export class DatabaseOptions {
    constructor(partial: Partial<DatabaseOptions> = {}) {
        Object.assign(this, partial);
    }

    public dialect: Dialect;
    public host: string;
    public port: number;
    public username: string;
    public password: string;
    public database: string;
    public sync: boolean;
    public initModels: boolean;
}