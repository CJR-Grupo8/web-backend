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
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

import { Public } from '../auth/decorators/isPublic.decorator';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  // ROTA PROTEGIDA (só admin pode criar)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  // ROTA PÚBLICA (qualquer um pode ver a lista)
  @Public()
  @Get()
  findAll(@Query('lojaId', new ParseIntPipe({ optional: true })) lojaId?: number) {
    if (lojaId) {
      return this.produtosService.findByLoja(lojaId);
    }
    return this.produtosService.findAll();
  }

  // ROTA PÚBLICA (qualquer um pode ver um produto)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.findOne(id);
  }

  // ROTA PROTEGIDA (só admin pode atualizar)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    return this.produtosService.update(id, updateProdutoDto);
  }

  // ROTA PROTEGIDA (só admin pode deletar)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produtosService.remove(id);
  }
}
