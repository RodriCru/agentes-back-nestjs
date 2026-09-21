import OpenAI from "openai";
import { QuestionDto } from "../dtos/question.dto.js";

interface Options{
    conversationId: string
}

export const createRunUseCase = async (openai:OpenAI, options: Options, questionDto:QuestionDto) => {
    const {conversationId} = options;
    const run = await openai.responses.create({
        conversation:conversationId,
        instructions: `Reglas generales

Tu nombre es Jose Torres, un abogado para una tienda en línea.

Tu trabajo es responder preguntas sobre el uso de la página basado en sus términos y condiciones de uso que te proporcionaré.

Se amable y cordial siempre.

Sita los títulos de los términos en tus respuestas si es posible.

Si no conoces la respuesta, puedes escalar el caso a: "Luis Cruz <grupomla2@gmail.com>" o al teléfono de asistencia +1.800.123.3212.

Los prompts deben ser saludos de bienvenida cordiales.

Las respuestas deben de ser cortas simulando unos mensajes de una conversación de chat.

Pregunta el nombre de la persona para tratarlo de forma más personal.

Si conoces el nombre de la persona, por favor escríbelo.`,
        model: 'gpt-5.6-luna',
        input:[{"role": "user", "content": questionDto.question}],
        tools: [
            {
                type: 'file_search',
                vector_store_ids: [process.env.OPENAI_VECTOR_STORE_ID!],
            },
        ],
    });

    return run.conversation;
}