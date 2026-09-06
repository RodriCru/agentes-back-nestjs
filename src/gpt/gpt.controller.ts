import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service.js';
import { OrthographyDto } from './dtos/index.js';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ){

    return this.gptService.orthographyCheck(orthographyDto);
  }
}
