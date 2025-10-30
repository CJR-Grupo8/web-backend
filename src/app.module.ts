import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth-guard';

// Módulos que precisam ser registrados
import { ProdutosModule } from './produtos/produtos.module';
import { LojasModule } from './lojas/lojas.module';
import { CommentsModule } from './comments/comments.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module'; // Importante para o Prisma

@Module({
  imports: [
    // 1. ConfigModule primeiro e global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 2. Módulos principais
    UsersModule, 
    AuthModule,
    PrismaModule, // Adiciona o Prisma para estar disponível
    HealthModule,

    // 3. MódYLOS QUE FALTAVAM (A CAUSA DO ERRO 404)
    //    Agora o Nest vai enxergar as rotas /produtos, /lojas, etc.
    ProdutosModule,
    LojasModule,
    CommentsModule,
    
    // O JwtModule foi removido daqui, pois o AuthModule já o importa
    // e configura. Importá-lo aqui é redundante.
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

