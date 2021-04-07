import { Module } from '@nestjs/common';

import { MessagesModule } from './resources/messages/messages.module';

@Module({
  imports: [MessagesModule],
})
export class AppModule {}
