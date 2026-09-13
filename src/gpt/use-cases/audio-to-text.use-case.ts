import OpenAI from "openai";
import type { ContainerClient } from "@azure/storage-blob";
import * as fs from 'fs';
interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async ( openai: OpenAI, containerClient: ContainerClient | null, options: Options ) => {
    const { prompt, audioFile } = options;

    const response = await openai.audio.transcriptions.create({
        model:'whisper-1',
        file: fs.createReadStream( audioFile.path ),
        prompt: prompt, //mismo idioma del audio
        language: 'es',
        response_format: 'verbose_json',
    })

    // Si hay containerClient de Azure configurado, se sube ahí bajo el prefijo "uploads/" (carpeta virtual, igual que en local) y se borra la copia temporal en disco; si no, se deja en disco local (ya guardado por multer).
    if ( containerClient ) {
        const blockBlobClient = containerClient.getBlockBlobClient( `uploads/${ audioFile.filename }` );
        await blockBlobClient.uploadFile( audioFile.path, {
            blobHTTPHeaders: { blobContentType: audioFile.mimetype },
        });

        fs.unlinkSync( audioFile.path );
    }

    return response;
}