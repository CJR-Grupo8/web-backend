import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IslojaOwnerGuard } from 'src/auth/guards/is-loja-owner.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from 'src/auth/guards/auth-guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [ProdutosController],
  providers: [ProdutosService, AuthGuard, IslojaOwnerGuard],
  exports: [ProdutosService],
})
export class ProdutosModule {}
