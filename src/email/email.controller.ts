import { Controller,Post, Body } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Public } from "src/auth/decorators/isPublic.decorator";

@Controller('email')
export class EmailController{
    constructor(private readonly emailService: EmailService){}

    @Public()
    @Post('forgot-password')
    forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{message:string}>{
        return this.emailService.forgotPassword(dto.email);
    }

    @Public()
    @Post('reset-password')
    resetPassword(@Body() dto: ResetPasswordDto): Promise<{message:string}>{
        return this.emailService.resetPassword(dto.token, dto.newPassword);
    }
}
