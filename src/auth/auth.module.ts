import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
// 1. Importe o seu AuthGuard
import { AuthGuard } from './guards/auth-guard'; 

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService], 
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    PrismaService, 
    UsersService,
    AuthGuard, // 2. Adicione o AuthGuard aos providers
  ],
  // 3. Exporte o AuthGuard e o JwtModule
  //    Isso resolve o erro "UnknownDependenciesException"
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}

