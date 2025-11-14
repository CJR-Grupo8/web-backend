import { IsString, MinLength } from "class-validator";

export class resetPasswordDto{
    @IsString()
    token: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}