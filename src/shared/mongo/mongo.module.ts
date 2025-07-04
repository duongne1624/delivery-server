import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBConfig } from '@config/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => MongoDBConfig.getMongoConfig(),
    }),
  ],
})
export class MongoModule {}
