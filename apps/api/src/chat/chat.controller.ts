import { Controller, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Req() req: Request) {
    const { message, history } = req.body;
    return await this.chatService.getChatResponse(message, history);
  }
}
