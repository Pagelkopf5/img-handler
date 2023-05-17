import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImgController } from './img/img.controller';
import { ImgService } from './img/img.service';
import { MongoClient } from 'mongodb';

@Module({
  imports: [],
  controllers: [ImgController],
  providers: [ImgService, {
    provide: 'MongoClient',
    useFactory: async () => {
      const mongoClient = new MongoClient(process.env.MONGODB_URI);
      await mongoClient.connect();
      return mongoClient;
    },
  }],
})
export class AppModule {}
