import { IsString } from "class-validator";

export class QuestionDto{
    @IsString()
    readonly conversationId: string;

    @IsString()
    readonly question: string;
}