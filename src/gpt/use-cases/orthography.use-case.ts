import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";


interface Options{
    prompt: string;
}

export const orthographyCheckUseCase = async( ai: OpenAI /*GoogleGenAI */, options: Options ) =>{
    
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
                Te serán preveídos textos en español con posibles errores ortográficos y gramaticales,
                Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
                Debes de responder en formato JSON,
                tu tarea es corregirlos y retornar información soluciones,
                también debes de dar un porcentaje de acierto por el usuario,

                Si no hay errores, debes de retornar un mensaje de felicitaciones.

                Ejemplo de salida:
                {
                    userScore: number,
                    errors: string[], //['error -> solución']
                    message: string, // Usa emojis y texto para felicitar al usuario
                }


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
        response_format: { type: "json_object" },
        thinking: { type: "disabled" },
    } as any);

    console.log(completion);

    const content = completion.choices[0].message.content;

    if (!content) {
        throw new Error('La respuesta de la API está vacía');
    }

    const jsonResp = JSON.parse(content);

    return jsonResp;

}