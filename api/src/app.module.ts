import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MessagesModule } from './resources/messages/messages.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/sentiment-analysis'),
    MessagesModule,
  ],
})
export class AppModule {}
