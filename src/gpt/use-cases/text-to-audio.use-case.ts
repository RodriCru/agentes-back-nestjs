import OpenAI from "openai";
import type { ContainerClient } from "@azure/storage-blob";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

interface Options {
    prompt: string;
    voice?: string;
}

export const textToAudioUseCase = async ( openai: OpenAI, containerClient: ContainerClient | null, { prompt, voice }: Options ) => {

    const voices: Record<string, string> = {
        nova: 'nova',
        alloy: 'alloy',
        echo: 'echo',
        fable: 'fable',
        onyx: 'onyx',
        shimmer: 'shimmer',
    }

    const selectedVoice = voices[voice ?? 'nova'] ?? 'nova';

    const mp3 = await openai.audio.speech.create({
        model: 'gpt-4o-mini-tts',
        voice: selectedVoice,
        input: prompt,
        response_format:'mp3',
    });

    const buffer = Buffer.from( await mp3.arrayBuffer() );
    const fileId = `${ new Date().getTime() }`;

    // Si hay containerClient de Azure configurado, se guarda ahí bajo el prefijo "audios/" (carpeta virtual, igual que en local); si no, se usa disco local como respaldo.
    if ( containerClient ) {
        const blockBlobClient = containerClient.getBlockBlobClient( `audios/${ fileId }.mp3` );
        await blockBlobClient.uploadData( buffer, {
            blobHTTPHeaders: { blobContentType: 'audio/mp3' },
        });

        return { fileId, buffer };
    }

    const folderPath = path.resolve( __dirname, '../../../generated/audios');
    fs.mkdirSync( folderPath, { recursive: true } );
    fs.writeFileSync( path.resolve( folderPath, `${ fileId }.mp3` ), buffer );

    return { fileId, buffer };
}
