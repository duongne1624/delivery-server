import { MongooseModuleOptions } from '@nestjs/mongoose';

export class MongoDBConfig {
  static getMongoConfig(): MongooseModuleOptions {
    return {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery',
      dbName: process.env.MONGO_DB_NAME || 'food_delivery',
    };
  }
}
