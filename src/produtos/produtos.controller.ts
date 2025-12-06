import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors, // Novo
  UploadedFile,    // Novo
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Novo
import { diskStorage } from 'multer'; // Novo
import { extname } from 'path'; // Novo
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

import { Public } from '../auth/decorators/isPublic.decorator';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { IslojaOwnerGuard } from 'src/auth/guards/is-loja-owner.guard';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  // --- CRIAR PRODUTO COM FOTO ---
  @UseGuards(AuthGuard, IslojaOwnerGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', { // 'file' é o nome do campo no Frontend
      storage: diskStorage({
        destination: './uploads/produtos', // Salva em pasta específica
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() body: any, // Recebemos como 'any' pois o FormData transforma números em string
    @UploadedFile() file?: Express.Multer.File,
    @Query('lojaId') queryLojaId?: string,
  ) {
    // 1. Converter os dados (FormData envia tudo como texto)
    const lojaIdRaw = body.lojaId || queryLojaId;
    
    const createProdutoDto: CreateProdutoDto = {
      nome: body.nome,
      descricao: body.descricao,
      categoria: body.categoria,
      // Convertendo strings para números
      preco: parseFloat(body.preco),
      quantidade: parseInt(body.quantidade, 10),
      lojaId: parseInt(lojaIdRaw, 10),
      // Se vier avaliação, converte, senão undefined
      avaliacao: body.avaliacao ? parseFloat(body.avaliacao) : undefined,
      // Se tiver arquivo, cria o caminho. Se não, usa string vazia ou trata erro
      imageUrl: file ? `uploads/produtos/${file.filename}` : '',
    };

    return this.produtosService.create(createProdutoDto);
  }
  // ------------------------------

  @Public()
  @Get()
  findAll(@Query('lojaId', new ParseIntPipe({ optional: true })) lojaId?: number) {
    if (lojaId) {
      return this.produtosService.findByLoja(lojaId);
    }
    return this.produtosService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.findOne(id);
  }

  @UseGuards(AuthGuard, IslojaOwnerGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @UseGuards(AuthGuard, IslojaOwnerGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.remove(id);
  }
}