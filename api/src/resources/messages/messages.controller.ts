import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll() {
    return this.messagesService.findAll();
  }

  @Post()
  async create(@Body() createCatDto: CreateMessageDto) {
    await this.messagesService.create(createCatDto);
  }

  @Delete(':id')
  async delete(@Param('name') name: string) {
    await this.messagesService.delete(name);
  }
}
