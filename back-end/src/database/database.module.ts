import { Module } from '@nestjs/common';
import { databaseConnection } from './database-connection';

@Module({
  providers: [...databaseConnection],
  exports: [...databaseConnection],
})
export class DatabaseModule {}