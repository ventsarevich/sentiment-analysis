import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { MessageBase } from '../interfaces/message.interface';

export type MessageDocument = Message & Document;

@Schema()
export class Message implements MessageBase {
  constructor(text: string) {
    this.text = text;
  }

  @Prop({ required: true, index: true, unique: true })
  readonly text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
