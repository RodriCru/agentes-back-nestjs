import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases/orthography.use-case.js';
import { OrthographyDto } from './dtos/index.js';
import OpenAI from "openai";


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
}
