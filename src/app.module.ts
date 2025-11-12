import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth-guard';


import { ProdutosModule } from './produtos/produtos.module';
import { LojasModule } from './lojas/lojas.module';
import { CommentsModule } from './comments/comments.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module'; 

@Module({
  imports: [
    // 1. ConfigModule primeiro e global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. Módulos principais
    UsersModule, 
    AuthModule,
    PrismaModule, 
    HealthModule,

    ProdutosModule,
    LojasModule,
    CommentsModule,
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Configuração do Guarda Global
    {
      provide : APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule {}

