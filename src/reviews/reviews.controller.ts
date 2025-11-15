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
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { Public } from '../auth/decorators/isPublic.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ROTA PROTEGIDA (só usuários logados podem avaliar)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.reviewsService.create(createReviewDto, userId);
  }

  // ROTA PÚBLICA (qualquer um pode ver as avaliações)
  @Public()
  @Get()
  findAll(
    @Query('lojaId', new ParseIntPipe({ optional: true })) lojaId?: number,
    @Query('produtoId', new ParseIntPipe({ optional: true })) produtoId?: number,
    @Query('authorId', new ParseIntPipe({ optional: true })) authorId?: number,
  ) {
    return this.reviewsService.findAll(lojaId, produtoId, authorId);
  }

  // ROTA PÚBLICA (qualquer um pode ver estatísticas da loja)
  @Public()
  @Get('loja/:lojaId/stats')
  getLojaStats(@Param('lojaId', ParseIntPipe) lojaId: number) {
    return this.reviewsService.getLojaStats(lojaId);
  }

  // ROTA PÚBLICA (qualquer um pode ver estatísticas do produto)
  @Public()
  @Get('produto/:produtoId/stats')
  getProdutoStats(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.reviewsService.getProdutoStats(produtoId);
  }

  // ROTA PÚBLICA (qualquer um pode ver uma avaliação)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  // ROTA PROTEGIDA (só o autor logado pode atualizar sua avaliação)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.reviewsService.update(id, updateReviewDto, userId);
  }

  // ROTA PROTEGIDA (só o autor logado pode deletar sua avaliação)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.reviewsService.remove(id, userId);
  }
}
