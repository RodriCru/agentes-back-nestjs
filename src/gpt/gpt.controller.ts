import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service.js';
import { OrthographyDto, ProsConsDicusserDto, TextToAudioDto, TranslateDto } from './dtos/index.js';
import type { Response } from 'express'

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ){

    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(
    @Body() prosConsDiscusser: ProsConsDicusserDto
  ){
    return this.gptService.prosConsDicusser(prosConsDiscusser);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDicusserDto,
    @Res() res: Response,
  ){
    const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status( HttpStatus.OK );

    for await( const chunk of stream ){
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  async translate(
    @Body() translateDto: TranslateDto,
  ){
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ){
    const { fileId, buffer } = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader( 'Content-Type', 'audio/mp3');
    res.setHeader( 'X-File-Id', fileId);
    res.status(HttpStatus.OK);
    res.send(buffer);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ){
    const buffer = await this.gptService.textToAudioGetter(fileId);

    res.setHeader( 'Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.send(buffer);
  }
}
