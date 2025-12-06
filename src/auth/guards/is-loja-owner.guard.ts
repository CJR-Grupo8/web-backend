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

        if(!user || !user.sub){
            console.log('IslojaOwnerGuard: User ou user.sub faltando', user);
            throw new ForbiddenException ('Usuário não autenticado ou token inválido!');
        }
        
        const userId = Number(user.sub);

        //criação do produto(lojaId no body ou query)
        if(req.method == 'POST'){
            const body = req.body as any;
            let lojaId = body?.lojaId;
            
            // Se não estiver no body (ex: multipart/form-data antes do parse), tenta na query
            if (!lojaId && req.query.lojaId) {
                lojaId = req.query.lojaId;
            }

            if(!lojaId){
                throw new ForbiddenException(`lojaId é obrigatório. Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(req.body)}`);
            }

            const loja = await this.prisma.loja.findUnique({
                where: {id: Number(lojaId)},
                select: {donoId: true},
            });
            if(!loja){
                throw new NotFoundException(`Loja ${lojaId} não encontrada`);
            }
            
            if(loja.donoId !== userId){
                throw new ForbiddenException(`Apenas o dono da loja pode adicionar produtos. Dono: ${loja.donoId}, User: ${userId}`);
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
        if(produto.loja.donoId !== userId){
            throw new ForbiddenException('Apenas o dono da loja pode modificar/excluir este produto');
        }
        return true;
    }
 }

