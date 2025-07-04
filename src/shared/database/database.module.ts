import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '@config/database.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(DatabaseConfig.getTypeOrmConfig())],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
