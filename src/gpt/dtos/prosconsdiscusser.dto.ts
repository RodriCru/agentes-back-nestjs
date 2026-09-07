import { IsString } from "class-validator";


export class ProsConsDicusserDto {
    @IsString()
    readonly prompt: string;
}