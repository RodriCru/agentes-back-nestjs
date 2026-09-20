import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createConversationIdUseCase } from './use-cases/create-conversation-id.use-case.js';
import { createRunUseCase } from './use-cases/create-run.use-case.js';
import { getMessageListUseCase } from './use-cases/get-message-list.use-case.js';
import { QuestionDto } from './dtos/question.dto.js';


@Injectable()
export class JoseAssistantService {

    /** Implemntación si se DEEPSECK */
    private ai = new OpenAI({
        baseURL: 'https://api.deepseek.com', // Si se usa una API KEY de chat gsp eliminar esta linea.
        apiKey: process.env.DEEPSEEK_API_KEY,
    })

    private openAi = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    async createConversarionId(){
        return await createConversationIdUseCase(this.openAi);
    }

    async createConversation(questionDto:QuestionDto){
        const {conversationId} = questionDto
        const answer = await createRunUseCase(this.openAi, {conversationId}, questionDto)
        const history = await getMessageListUseCase(this.openAi, {conversationId})

        return { answer, history }
    }

    async getMessageList(conversationId: string){
        return await getMessageListUseCase(this.openAi, {conversationId})
    }
}
