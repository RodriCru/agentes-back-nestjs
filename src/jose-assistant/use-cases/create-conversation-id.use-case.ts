import OpenAI from "openai";

export const createConversationIdUseCase = async(openAi: OpenAI) =>{
    const {id} = await openAi.conversations.create();

    //console.log({conversation}); para activar esta linea quitar el { id } y sustituirlo por "conversation"

    return { id };
}