import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, authorId: number) {
    // Validar que pelo menos um ID (loja ou produto) foi fornecido
    if (!createReviewDto.lojaId && !createReviewDto.produtoId) {
      throw new BadRequestException(
        'lojaId ou produtoId deve ser fornecido',
      );
    }

    // Não permitir ambos ao mesmo tempo
    if (createReviewDto.lojaId && createReviewDto.produtoId) {
      throw new BadRequestException(
        'Forneça apenas lojaId OU produtoId, não ambos',
      );
    }

    // Verificar se a loja existe (se fornecido)
    if (createReviewDto.lojaId) {
      const loja = await this.prisma.loja.findUnique({
        where: { id: createReviewDto.lojaId },
      });

      if (!loja) {
        throw new NotFoundException(
          `Loja with ID ${createReviewDto.lojaId} not found`,
        );
      }
    }

    // Verificar se o produto existe (se fornecido)
    if (createReviewDto.produtoId) {
      const produto = await this.prisma.produto.findUnique({
        where: { id: createReviewDto.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(
          `Produto with ID ${createReviewDto.produtoId} not found`,
        );
      }
    }

    // Verificar se o autor existe
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException(
        `User with ID ${authorId} not found`,
      );
    }

    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        authorId,
      },
      include: {
        loja: createReviewDto.lojaId ? {
          select: {
            id: true,
            nome: true,
            descricao: true,
          },
        } : false,
        produto: createReviewDto.produtoId ? {
          select: {
            id: true,
            nome: true,
            preco: true,
            descricao: true,
          },
        } : false,
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return review;
  }

  async findAll(lojaId?: number, produtoId?: number, authorId?: number) {
    const where: any = {};

    if (lojaId) {
      where.lojaId = lojaId;
    }

    if (produtoId) {
      where.produtoId = produtoId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    return this.prisma.review.findMany({
      where,
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
          },
        },
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            descricao: true,
          },
        },
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
          },
        },
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            descricao: true,
          },
        },
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByLoja(lojaId: number) {
    return this.findAll(lojaId);
  }

  async findByProduto(produtoId: number) {
    return this.findAll(undefined, produtoId);
  }

  async findByAuthor(authorId: number) {
    return this.findAll(undefined, undefined, authorId);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    // Verificar se a avaliação existe
    const existingReview = await this.findOne(id);

    // Verificar se o usuário é o autor da avaliação
    if (existingReview.authorId !== userId) {
      throw new NotFoundException(
        'You are not authorized to update this review',
      );
    }

    // Calcular os valores finais após o update
    const finalLojaId = updateReviewDto.lojaId !== undefined 
      ? updateReviewDto.lojaId 
      : existingReview.lojaId;
    const finalProdutoId = updateReviewDto.produtoId !== undefined 
      ? updateReviewDto.produtoId 
      : existingReview.produtoId;

    // Validar exclusividade mútua: não permitir ambos lojaId e produtoId
    if (finalLojaId && finalProdutoId) {
      throw new BadRequestException(
        'Uma avaliação não pode ter lojaId e produtoId ao mesmo tempo. Forneça null para um deles.',
      );
    }

    // Validar que pelo menos um ID está presente
    if (!finalLojaId && !finalProdutoId) {
      throw new BadRequestException(
        'Uma avaliação deve ter lojaId OU produtoId',
      );
    }

    // Validar lojaId se estiver sendo atualizado
    if (updateReviewDto.lojaId !== undefined && updateReviewDto.lojaId !== null) {
      const loja = await this.prisma.loja.findUnique({
        where: { id: updateReviewDto.lojaId },
      });

      if (!loja) {
        throw new NotFoundException(
          `Loja with ID ${updateReviewDto.lojaId} not found`,
        );
      }
    }

    // Validar produtoId se estiver sendo atualizado
    if (updateReviewDto.produtoId !== undefined && updateReviewDto.produtoId !== null) {
      const produto = await this.prisma.produto.findUnique({
        where: { id: updateReviewDto.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(
          `Produto with ID ${updateReviewDto.produtoId} not found`,
        );
      }
    }

    // Validar authorId se estiver sendo atualizado
    if (updateReviewDto.authorId !== undefined) {
      const author = await this.prisma.user.findUnique({
        where: { id: updateReviewDto.authorId },
      });

      if (!author) {
        throw new NotFoundException(
          `User with ID ${updateReviewDto.authorId} not found`,
        );
      }
    }

    const review = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        loja: {
          select: {
            id: true,
            nome: true,
            descricao: true,
          },
        },
        produto: {
          select: {
            id: true,
            nome: true,
            preco: true,
            descricao: true,
          },
        },
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return review;
  }

  async remove(id: number, userId: number) {
    // Verificar se a avaliação existe
    const existingReview = await this.findOne(id);

    // Verificar se o usuário é o autor da avaliação
    if (existingReview.authorId !== userId) {
      throw new NotFoundException(
        'You are not authorized to delete this review',
      );
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { message: `Review with ID ${id} deleted successfully` };
  }

  async getLojaStats(lojaId: number) {
    // Verificar se a loja existe
    const loja = await this.prisma.loja.findUnique({
      where: { id: lojaId },
    });

    if (!loja) {
      throw new NotFoundException(`Loja with ID ${lojaId} not found`);
    }

    const reviews = await this.prisma.review.findMany({
      where: { lojaId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        lojaId,
        totalReviews: 0,
        averageRating: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      lojaId,
      totalReviews: reviews.length,
      averageRating: Number(averageRating.toFixed(2)),
    };
  }

  async getProdutoStats(produtoId: number) {
    // Verificar se o produto existe
    const produto = await this.prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      throw new NotFoundException(
        `Produto with ID ${produtoId} not found`,
      );
    }

    const reviews = await this.prisma.review.findMany({
      where: { produtoId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        produtoId,
        totalReviews: 0,
        averageRating: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      produtoId,
      totalReviews: reviews.length,
      averageRating: Number(averageRating.toFixed(2)),
    };
  }
}
