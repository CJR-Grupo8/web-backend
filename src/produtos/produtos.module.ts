import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IslojaOwnerGuard } from 'src/auth/guards/is-loja-owner.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ProdutosController],
  providers: [ProdutosService, IslojaOwnerGuard],
  exports: [ProdutosService],
})
export class ProdutosModule {}
