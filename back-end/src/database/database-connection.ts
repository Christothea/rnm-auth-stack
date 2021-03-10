import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../app-config/config.service';
import { User } from './models/user-db.model';

export const databaseConnection = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                logging: false,
                sync: { alter: true },
                dialect: ConfigService.getDbConfig().dialect,
                define: {
                    charset: 'utf8',
                    collate: 'utf8_general_ci'
                },
                host: ConfigService.getDbConfig().host,
                port: ConfigService.getDbConfig().port,
                username: ConfigService.getDbConfig().username,
                password: ConfigService.getDbConfig().password,
                database: ConfigService.getDbConfig().database,
            });
            sequelize.addModels([User]);
            await sequelize.sync();
            return sequelize;
        },
    },
];