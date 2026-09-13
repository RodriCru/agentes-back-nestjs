import OpenAI from "openai";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

interface Options {
    prompt: string;
    voice?: string;
}

export const textToAudioUseCase = async ( openai: OpenAI, { prompt, voice }: Options ) => {

    const voices: Record<string, string> = {
        nova: 'nova',
        alloy: 'alloy',
        echo: 'echo',
        fable: 'fable',
        onyx: 'onyx',
        shimmer: 'shimmer',
    }

    const selectedVoice = voices[voice ?? 'nova'] ?? 'nova';

    const folderPath = path.resolve( __dirname, '../../../generated/audios');
    const speechFile = path.resolve( `${ folderPath }/${ new Date().getTime() }.mp3` );

    fs.mkdirSync( folderPath, { recursive: true } );

    const mp3 = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: selectedVoice,
        input: prompt,
        response_format:'mp3',
    });

    //console.log(mp3);

    const buffer = Buffer.from( await mp3.arrayBuffer() );
    fs.writeFileSync( speechFile, buffer);

    return speechFile;
}