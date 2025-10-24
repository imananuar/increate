import { IsString } from "class-validator";

export class PromptDto {
    @IsString()
    role: string;

    @IsString()
    content: string;
}