import { Module } from '@nestjs/common';
import { JoseAssistantService } from './jose-assistant.service.js';
import { JoseAssistantController } from './jose-assistant.controller.js';

@Module({
  controllers: [JoseAssistantController],
  providers: [JoseAssistantService],
})
export class JoseAssistantModule {}
