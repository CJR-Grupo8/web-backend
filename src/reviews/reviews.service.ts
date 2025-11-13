import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    // Verificar se a loja existe
    const loja = await this.prisma.loja.findUnique({
      where: { id: createReviewDto.lojaId },
    });

    if (!loja) {
      throw new NotFoundException(
        `Loja with ID ${createReviewDto.lojaId} not found`,
      );
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
        loja: {
          select: {
            id: true,
            nome: true,
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

  async findAll(lojaId?: number, authorId?: number) {
    const where: any = {};

    if (lojaId) {
      where.lojaId = lojaId;
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

  async findByAuthor(authorId: number) {
    return this.findAll(undefined, authorId);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    // Verificar se a avaliação existe
    await this.findOne(id);

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
}
