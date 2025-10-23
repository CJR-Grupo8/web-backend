import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    // Check if author exists
    const author = await this.prisma.user.findUnique({
      where: { id: createCommentDto.authorId },
    });

    if (!author) {
      throw new NotFoundException(`User with ID ${createCommentDto.authorId} not found`);
    }

    const comment = await this.prisma.comment.create({
      data: createCommentDto,
      include: {
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

    return comment;
  }

  async findAll() {
    return this.prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
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

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    // Check if comment exists
    await this.findOne(id);

    const comment = await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });

    return comment;
  }

  async remove(id: number) {
    // Check if comment exists
    await this.findOne(id);

    await this.prisma.comment.delete({
      where: { id },
    });

    return { message: `Comment with ID ${id} deleted successfully` };
  }

  async findByAuthor(authorId: number) {
    // Check if author exists
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    return this.prisma.comment.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
