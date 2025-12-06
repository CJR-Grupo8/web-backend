import { Module } from "@nestjs/common";
import { EmailService} from './email.service'; 
import { EmailController} from './email.controller';
import { PrismaModule } from "src/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [PrismaModule, ConfigModule],
    providers:[EmailService],
    controllers:[EmailController],
    exports: [EmailService],
}) 
export class EmailModule{}