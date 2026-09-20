import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JoseAssistantService } from './jose-assistant.service.js';
import { QuestionDto } from './dtos/question.dto.js';

@Controller('jose-assistant')
export class JoseAssistantController {
  constructor(private readonly joseAssistantService: JoseAssistantService) {}

  @Post('create-conversation')
  async createThread(){
    return this.joseAssistantService.createConversarionId();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto){
    return this.joseAssistantService.createConversation(questionDto);
  }

  @Get('messages/:conversationId')
  async getMessageList(@Param('conversationId') conversationId: string){
    return this.joseAssistantService.getMessageList(conversationId);
  }
}
