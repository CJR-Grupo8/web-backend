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
import { LojasService } from './lojas.service';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';

import { Public } from '../auth/decorators/isPublic.decorator';

@Controller('lojas')
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  // ROTA PROTEGIDA (usuário logado deve criar a loja)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLojaDto: CreateLojaDto) {
    return this.lojasService.create(createLojaDto);
  }

  // ROTA PÚBLICA (qualquer um pode ver a lista de lojas)
  @Public()
  @Get()
  findAll(@Query('donoId', new ParseIntPipe({ optional: true })) donoId?: number) {
    if (donoId) {
      return this.lojasService.findByDono(donoId);
    }
    return this.lojasService.findAll();
  }

  // ROTA PÚBLICA (qualquer um pode ver os detalhes de uma loja)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lojasService.findOne(id);
  }

  // ROTA PROTEGIDA (só o dono logado pode atualizar)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLojaDto: UpdateLojaDto,
  ) {
    return this.lojasService.update(id, updateLojaDto);
  }

  // ROTA PROTEGIDA (só o dono logado pode deletar)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lojasService.remove(id);
  }
}
