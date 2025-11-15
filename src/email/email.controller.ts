import { Controller,Post, Body } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('email')
export class EmailController{
    constructor(private readonly emailService: EmailService){}

    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{message:string}>{
        return this.emailService.forgotPassword(dto.email);
    }

    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto): Promise<{message:string}>{
        return this.emailService.resetPassword(dto.token, dto.newPassword);
    }
}
