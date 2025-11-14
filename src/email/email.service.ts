import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as nodemailer from 'nodemailer';
import { hash, randomUUID, secureHeapUsed } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService{
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private prisma: PrismaService , private config : ConfigService){
        //nodemailer trasnporter configurado via .env
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }


    // gerar um token, salvar no usuario  e envia email com link

    async forgotPassword(email:string){
        const user = await this.prisma.user.findUnique({where: { email } });
        if(!user){
            throw new NotFoundException('Usúario não encontrado');
        }

        const token = randomUUID();
        const expires = new Date(Date.now() + 1000 *60 *15); //15 minutos para expirar o forgotpassword
        await this.prisma.user.update({
            where: {id: user.id},
            data: {
                passwordResetExpires: expires,
                passwordResetToken: token,
            },
        });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        //enviar o email, pode falhar(capturar o erro se preciso)
        const info = await this.transporter.sendMail({
            from: `"Suporte" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Redefinição de senha',
            html: `
            <p>Você solicitou redefinição de senha.</p>
            <p>Clique no link abaixo para redefinir (válido por 15 minutos):</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Se você não solicitou, ignore este e-mail.</p>
           `,
        });
        this.logger.debug(`Password reset email sent to ${email}: ${info.messageId}`);
        return { message: 'E-mail de recuperação enviado'};
    }

    //valida token e altera a senha 
    async resetPassword(token: string, newPassword: string){
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {gt: new Date()},
            },
        });

        if(!user){
            throw new BadRequestException('Token inválido ou expirado');
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: {id: user.id},
            data: {
                password: hashed,
                passwordResetExpires:null,
                passwordResetToken:null,
            },
        });
        this.logger.debug(`Password reset for user ${user.id}`);
        return {message: 'Senha alterada com sucesso!'};
    }

    //envio do email SMTP

    private async sendEmail({ to, subject, text}){
        const transporter = nodemailer.createTransport({
            host: this.config.get('EMAIL_HOST'),
            port: Number(this.config.get('EMAIL_USER')),
            auth: {
                user: this.config.get('EMAIL_USER'),
                pass: this.config.get('EMAIL_PASS'),
            },
        });
        await transporter.sendEmail({
            from: this.config.get('EMAIL_FROM'),
            to,
            subject,
            text,
        });
    }
}

