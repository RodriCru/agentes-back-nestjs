import OpenAI from "openai";

interface Options{
    conversationId: string;
}

export const getMessageListUseCase = async(openai: OpenAI, options: Options) => {
    const {conversationId} = options;

    const messageList = await openai.conversations.items.list(conversationId);

    return messageList;
}