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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

import { Public } from '../auth/decorators/isPublic.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // ROTA PROTEGIDA (só usuários logados podem comentar)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  // ROTA PÚBLICA (qualquer um pode ler os comentários)
  @Public()
  @Get()
  findAll(@Query('authorId', new ParseIntPipe({ optional: true })) authorId?: number) {
    if (authorId) {
      return this.commentsService.findByAuthor(authorId);
    }
    return this.commentsService.findAll();
  }

  // ROTA PÚBLICA (qualquer um pode ler um comentário)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  // ROTA PROTEGIDA (só o autor logado pode atualizar)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  // ROTA PROTEGIDA (só o autor logado pode deletar)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
