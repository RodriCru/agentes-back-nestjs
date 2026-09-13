import OpenAI from "openai";


interface Options{
    prompt: string;
    lang: string;
}

export const translateUseCase = async( ai: OpenAI, options: Options) =>{
    const { prompt, lang} = options;

    const completion = await ai.chat.completions.create({
        messages:[
            { 
                role: "system",
                content:`Traduce el siguiente texto al idioma ${lang}:${ prompt }`
            },
        ],
        model: "deepseek-v4-flash",
        temperature: 0.3,
        max_tokens: 800,
        thinking: { type: "disabled" },
    } as any);

    //console.log(completion);

    return {message: completion.choices[0].message.content };
}