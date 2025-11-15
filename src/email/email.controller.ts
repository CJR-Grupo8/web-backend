import { Controller,Post, Body } from "@nestjs/common";
import { EmailService } from "./email.service";
import { forgotPasswordDto } from "./dto/forgot-password.dto";
import { resetPasswordDto } from "./dto/reset-password.dto";

@Controller('email')
export class EmailController{
    constructor(private readonly emailService: EmailService){}

    @Post('forgot-password')
    forgotPassword(@Body() dto: forgotPasswordDto): Promise<{message:string}>{
        return this.emailService.forgotPassword(dto.email);
    }

    @Post('reset-password')
    resetPasswrod(@Body() dto: resetPasswordDto): Promise<{message:string}>{
        return this.emailService.resetPassword(dto.token, dto.newPassword);
    }
}
