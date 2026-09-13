import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case.js';
import { OrthographyDto, ProsConsDicusserDto, TextToAudioDto, TranslateDto } from './dtos/index.js';
import OpenAI from "openai";
import { prosConsDicusserUseCase } from './use-cases/prosconsdiscusser.use-case.js';
import { prosConsDicusserStreamUseCase, translateUseCase } from './use-cases/index.js';
import { textToAudioUseCase } from './use-cases/text-to-audio.use-case.js';


const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

@Injectable()
export class GptService {

    /**Si se implementa una key de GEMINI AI es este código
     *  import { GoogleGenAI } from '@google/genai';
     * 
     *  private ai = new GoogleGenAI({
     *      apiKey: process.env.GEMINI_API_KEY,
     *  })
     * 
    */

    /** Implemntación si se DEEPSECK */
    private ai = new OpenAI({
        baseURL: 'https://api.deepseek.com', // Si se usa una API KEY de chat gsp eliminar esta linea.
        apiKey: process.env.DEEPSEEK_API_KEY,
    })

    private openAi = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    
    async orthographyCheck(orthograpyDto: OrthographyDto){
        return await orthographyCheckUseCase( this.ai, {
            prompt: orthograpyDto.prompt
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDicusserDto) {
        return await prosConsDicusserUseCase(this.ai, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDicusserDto) {
        return await prosConsDicusserStreamUseCase(this.ai, { prompt });
    }

    async translate({ prompt, lang}: TranslateDto) {
        return await translateUseCase(this.ai, { prompt, lang });
    }

    async textToAudio({ prompt, voice}: TextToAudioDto ) {
        return await textToAudioUseCase(this.openAi, { prompt, voice });
    }

    async textToAudioGetter( fileId: string ){
        const filePath = path.resolve( __dirname, '../../generated/audios', `${fileId}.mp3`);
        const wasFound = fs.existsSync (filePath);
       
        if( !wasFound ) throw new NotFoundException(`File ${ fileId } not found`);

        return filePath;
    }
}
