// ...existing code...
import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as nodemailer from 'nodemailer';
import { randomUUID, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService{
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private prisma: PrismaService , private config : ConfigService){
        // nodemailer transporter configurado via ConfigService/.env
        this.transporter = nodemailer.createTransport({
            host: this.config.get<string>('EMAIL_HOST'),
            port: Number(this.config.get<number>('EMAIL_PORT')) || 587,
            secure: this.config.get<string>('EMAIL_SECURE') === 'true',
            auth: {
                user: this.config.get<string>('EMAIL_USER'),
                pass: this.config.get<string>('EMAIL_PASS'),
            },
        });
    }

    // gerar um token (envia o token bruto por email) e salvar apenas o hash no banco
    async forgotPassword(email:string): Promise<{message:string}>{
        const user = await this.prisma.user.findUnique({ where: { email } });
        if(!user){
            throw new NotFoundException('Usuário não encontrado');
        }

        const token = randomUUID();
        const tokenHash = createHash('sha256').update(token).digest('hex');

        const expiresMs = Number(this.config.get<number>('RESET_TOKEN_EXPIRES_MS')) || (1000 * 60 * 15); // fallback 15 min
        const expires = new Date(Date.now() + expiresMs);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetExpires: expires,
                passwordResetToken: tokenHash,
            },
        });

        const resetUrl = `${this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/reset-password?token=${token}`;

        const html = `
            <p>Você solicitou redefinição de senha.</p>
            <p>Clique no link abaixo para redefinir (válido por ${Math.round(expiresMs/60000)} minutos):</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>Se você não solicitou, ignore este e-mail.</p>
        `;

        try {
            const info = await this.transporter.sendMail({
                from: this.config.get<string>('EMAIL_FROM') || `"Suporte" <${this.config.get<string>('EMAIL_USER')}>`,
                to: email,
                subject: 'Redefinição de senha',
                html,
            });
            this.logger.debug(`Password reset email sent to ${email}: ${info.messageId}`);
        } catch (err) {
            this.logger.error(`Failed to send password reset email to ${email}`, err as any);
            throw new InternalServerErrorException('Erro ao enviar e-mail de recuperação');
        }

        return { message: 'E-mail de recuperação enviado' };
    }

    // valida token (comparando hash) e altera a senha
    async resetPassword(token: string, newPassword: string): Promise<{message:string}>{
        const tokenHash = createHash('sha256').update(token).digest('hex');

        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: tokenHash,
                passwordResetExpires: { gt: new Date() },
            },
        });

        if(!user){
            throw new BadRequestException('Token inválido ou expirado');
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                passwordResetExpires: null,
                passwordResetToken: null,
            },
        });

        this.logger.debug(`Password reset for user ${user.id}`);
        return { message: 'Senha alterada com sucesso!' };
    }

    // utilitário de envio reutilizando o transporter já criado
    private async sendEmail(payload: { to: string; subject: string; text?: string; html?: string; }){
        try {
            const info = await this.transporter.sendMail({
                from: this.config.get<string>('EMAIL_FROM') || this.config.get<string>('EMAIL_USER'),
                to: payload.to,
                subject: payload.subject,
                text: payload.text,
                html: payload.html,
            });
            this.logger.debug(`Email enviado para ${payload.to}: ${info.messageId}`);
            return info;
        } catch (err) {
            this.logger.error('Erro no sendEmail', err as any);
            throw new InternalServerErrorException('Erro ao enviar e-mail');
        }
    }
}