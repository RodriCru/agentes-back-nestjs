import OpenAI, { toFile } from "openai";
import * as fs from 'fs';
import { downloadImageAsPng } from "../../helpers/download-image-as-png.helper.js";
import { randomUUID } from "crypto";
import path from "path";
import sharp from "sharp";
import { ContainerClient } from "@azure/storage-blob";

interface Options {
    baseImage: string;
}

export const imageVariationUseCase = async (openai: OpenAI,containerClient: ContainerClient | null, options: Options) => {
    const { baseImage } = options;

    const pngImagePath = await downloadImageAsPng(baseImage, true);
    console.log({ pngImagePath });

    const imageFile = await toFile( fs.createReadStream(pngImagePath), null, {
        type: 'image/png',
    } );

    const response = await openai.images.edit({
        model: 'gpt-image-1-mini',
        image: imageFile,
        prompt: 'Genera una variación creativa de la imagen, manteniendo el estilo y sujeto, pero con diferente composición o detalles',
        quality:'low',
        //n: 1,
        //size: '1024x1024'
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

        const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileId}.png`

        return {
            url: url,
            revised_promt: response.data?.[0].revised_prompt,
        }
    }

    const folderPath = path.resolve(__dirname, '../../../generated/images');
    fs.mkdirSync(folderPath, { recursive: true });

    const localPath = path.resolve(folderPath, `${fileId}.png`);
    fs.writeFileSync(localPath, buffer);

    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileId}.png`

    return {
        url: url,
        revised_promt: response.data?.[0].revised_prompt,
    }
}