import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../database/database.module';
import { usersDbProvider } from '../../database/users-db-provider';
import { ConfigService } from '../../app-config/config.service';
import { LoggingModule } from '../../logging/logging.module';
import { UsersService } from '../users-module/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jtw/jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt', session: true }),
        JwtModule.registerAsync({
            imports: [],
            useFactory: () => {
                return {
                    secret: ConfigService.AppEnv.AUTH_CONFIG_TOKEN_SECRET_KEY,
                    signOptions: { expiresIn: ConfigService.AppEnv.AUTH_CONFIG_TOKEN_EXPIRY_TIME_HOURS + 'h' },
                };
            },
            inject: [],
        }),
        LoggingModule,
        DatabaseModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        ...usersDbProvider,
        UsersService,
        AuthService,
        JwtStrategy,
    ],
})
export class AuthModule {}