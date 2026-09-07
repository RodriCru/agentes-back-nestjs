import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case.js';
import { OrthographyDto, ProsConsDicusserDto } from './dtos/index.js';
import OpenAI from "openai";
import { prosConsDicusserUseCase } from './use-cases/prosconsdiscusser.use-case.js';
import { prosConsDicusserStreamUseCase } from './use-cases/index.js';


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

    /** Implemntación si se usa OPEN AI o DEEPSECK */
    private ai = new OpenAI({
        baseURL: 'https://api.deepseek.com', // Si se usa una API KEY de chat gsp eliminar esta linea.
        apiKey: process.env.DEEPSEEK_API_KEY,
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
}
