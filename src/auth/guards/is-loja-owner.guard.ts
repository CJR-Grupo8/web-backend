import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    NotFoundException
} from '@nestjs/common';

import { PrismaService} from 'src/prisma/prisma.service';
import { Request } from 'express';
import { identity } from 'rxjs';

@Injectable()
export class IslojaOwnerGuard implements CanActivate{
    constructor(private prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request & {user?: any} = context.switchToHttp().getRequest();
        const user = req.user;

        if(!user || !user.id){
            throw new ForbiddenException ('Usuário não autenticado!');
        }
        
        //criação do produto(lojaId no body)
        if(req.method == 'POST'){
            const body = req.body as any;
            const lojaId = body?.lojaId;
            if(!lojaId){
                throw new ForbiddenException('lojaId é obrigatório para criar um produto');
            }

            const loja = await this.prisma.loja.findUnique({
                where: {id: Number(lojaId)},
                select: {donoId: true},
            });
            if(!loja){
                throw new NotFoundException('Loja não encontrada');
            }
            if(loja.donoId !== user.id){
                throw new ForbiddenException('Apenas o dono da loja pode adicionar produtos');
            }
            return true;
        }

        // update/delete do produto(produtoId em parametros)

        const produtoIdParam = (req.params as any)?.id;
        if(!produtoIdParam){
            throw new  ForbiddenException('ID do produto não informado');
        }
        const produtoId = Number(produtoIdParam);
        const produto = await this.prisma.produto.findUnique({
            where:{id:produtoId},
            include:{loja:true},
        });

        if(!produto){
            throw new NotFoundException('Produto não encontrado');
        }
        if(produto.loja.donoId !== user.id){
            throw new ForbiddenException('Apenas o dono da loja pode modificar/excluir este produto');
        }
        return true;
    }
 }

