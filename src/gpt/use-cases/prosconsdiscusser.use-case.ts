import OpenAI from "openai";


interface Options{
    prompt: string;
}

export const prosConsDicusserUseCase = async( ai: OpenAI, options: Options) =>{
    const { prompt } = options;

    /**
     * Si se implementa Gemini
     * 
     * import { GoogleGenAI } from "@google/genai";
     * 
     * Descomenta el GoogleGenAI de arriba y elimina el otro
     * 
     * const interaction = await ai.interactions.create({
     *   model: "gemini-3.8-flash",
     *   input: "Explain how AI works in a few words",
     *   });
     *   console.log(interaction.output_text);
     * 
     * Para mas documentación y ejemplos similares a lo que implementamos con deepseck
     * https://aistudio.google.com/docs/get-started?codelanguage=javascript
     * 
     */

    const completion = await ai.chat.completions.create({
        messages:[
            { 
                role: "system",
                content:
                `
                Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                la respuesta debe de ser en formato markdown, corta y concisa,
                los pros y contras deben de estar en una lista

                `
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
        model: "deepseek-v4-flash",
        temperature: 0.3,
        max_tokens: 800,
        thinking: { type: "disabled" },
    } as any);

    //console.log(completion);

    return completion.choices[0].message.content;
}