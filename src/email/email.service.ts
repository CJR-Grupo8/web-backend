import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as nodemailer from 'nodemailer';
import { randomUUID, secureHeapUsed } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailService{
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private prisma: PrismaService){
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
}