import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    // Validar que pelo menos um ID (loja ou produto) foi fornecido
    if (!createReviewDto.lojaId && !createReviewDto.produtoId) {
      throw new NotFoundException(
        'lojaId ou produtoId deve ser fornecido',
      );
    }

    // Não permitir ambos ao mesmo tempo
    if (createReviewDto.lojaId && createReviewDto.produtoId) {
      throw new NotFoundException(
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
      where: { id: createReviewDto.authorId },
    });

    if (!author) {
      throw new NotFoundException(
        `User with ID ${createReviewDto.authorId} not found`,
      );
    }

    const review = await this.prisma.review.create({
      data: createReviewDto,
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

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    // Verificar se a avaliação existe
    await this.findOne(id);

    // Validar lojaId se estiver sendo atualizado
    if (updateReviewDto.lojaId !== undefined) {
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
    if (updateReviewDto.produtoId !== undefined) {
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

  async remove(id: number) {
    // Verificar se a avaliação existe
    await this.findOne(id);

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
