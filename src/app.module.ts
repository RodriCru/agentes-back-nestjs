import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module.js';
import { ConfigModule } from '@nestjs/config';
import { JoseAssistantModule } from './jose-assistant/jose-assistant.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GptModule,
    JoseAssistantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
