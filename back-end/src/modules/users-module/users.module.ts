import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { usersDbProvider } from '../../database/users-db-provider';
import { LoggingModule } from '../../logging/logging.module';
import { LoggingService } from '../../logging/logging.service';
import { UsersService } from './users.service';

@Module({
  imports: [
    LoggingModule,
    DatabaseModule,
  ],
  providers: [
    ...usersDbProvider,
    UsersService,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule {
  constructor(
    private readonly loggingService: LoggingService,
  ) {
    this.loggingService.setContext(UsersModule.name);
  }
}