import { Module } from '@nestjs/common';
import { GptService } from './gpt.service.js';
import { GptController } from './gpt.controller.js';

@Module({
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}
