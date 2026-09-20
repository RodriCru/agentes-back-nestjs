import OpenAI, { toFile } from "openai";
import type { ContainerClient } from "@azure/storage-blob";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from "crypto";
import sharp from "sharp";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "../../helpers/download-image-as-png.helper.js";

const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

interface Options{
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async( openai: OpenAI, containerClient: ContainerClient | null, options:Options) =>{

    const { prompt, originalImage, maskImage} = options;

    //console.log({ prompt, originalImage, maskImage });

    /**
     * Si se desa generar una imagen mandando solo el promt cae en esta caso.
     */
    if ( !originalImage || !maskImage ){
        const response = await openai.images.generate({
            prompt: prompt,
            model: 'gpt-image-1-mini',
            n: 1,
            size: '1024x1024',
            quality: 'low',
        });

        const b64 = response.data?.[0].b64_json;
        const rawBuffer = Buffer.from( b64 ?? '', 'base64' );
        const buffer = await sharp( rawBuffer ).png().toBuffer();
        const fileId = `${randomUUID()}-${Date.now()}`;

        // Si hay containerClient de Azure configurado, se guarda ahí bajo el prefijo "images/" (carpeta virtual, igual que en local); si no, se usa disco local como respaldo.
        if ( containerClient ) {
            const blockBlobClient = containerClient.getBlockBlobClient( `images/${ fileId }.png` );
            await blockBlobClient.uploadData( buffer, {
                blobHTTPHeaders: { blobContentType: 'image/png' },
            });

            const url= `${ process.env.SERVER_URL}/gpt/image-generation/${fileId}.png`

            return {
                url:url,
                revised_promt: response.data?.[0].revised_prompt,
            }
        }

        const folderPath = path.resolve( __dirname, '../../../generated/images');
        fs.mkdirSync( folderPath, { recursive: true } );

        const localPath = path.resolve( folderPath, `${ fileId }.png` );
        fs.writeFileSync( localPath, buffer );

        const url= `${ process.env.SERVER_URL}/gpt/image-generation/${fileId}.png`

        return {
            url:url,
            revised_promt: response.data?.[0].revised_prompt,
        }
    }

    /**
     * Si se manda una imagen a editar usa toda esta lógica.
     */

    const pngImagePath = await downloadImageAsPng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng( maskImage, true );

    const imageFile = await toFile( fs.createReadStream(pngImagePath), null, {
        type: 'image/png',
    } );
    const maskFile = await toFile( fs.createReadStream(maskPath), null, {
        type: 'image/png',
    } );

    const response = await openai.images.edit({
        model: 'gpt-image-1-mini',
        prompt: prompt,
        image: imageFile,
        mask: maskFile,
        n: 1,
        size: "1024x1024"
    });

    const b64 = response.data?.[0].b64_json;
    const rawBuffer = Buffer.from(b64 ?? '', 'base64');
    const buffer = await sharp(rawBuffer).png().toBuffer();
    const fileId = `${randomUUID()}-${Date.now()}`;

    // Si hay containerClient de Azure configurado, se guarda ahí bajo el prefijo "images/" (carpeta virtual, igual que en local); si no, se usa disco local como respaldo.
    if (containerClient) {
        const blockBlobClient = containerClient.getBlockBlobClient(`images/${fileId}.png`);
        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: 'image/png' },
        });

        const url= `${ process.env.SERVER_URL}/gpt/image-generation/${fileId}.png`
        return {
            url:url,
            revised_promt: response.data?.[0].revised_prompt,
        }
    }

    const folderPath = path.resolve(__dirname, '../../../generated/images');
    fs.mkdirSync(folderPath, { recursive: true });

    const localPath = path.resolve(folderPath, `${fileId}.png`);
    fs.writeFileSync(localPath, buffer);

    const url= `${ process.env.SERVER_URL}/gpt/image-generation/${fileId}.png`
    return {
        url:url,
        revised_promt: response.data?.[0].revised_prompt,
    }

    

};